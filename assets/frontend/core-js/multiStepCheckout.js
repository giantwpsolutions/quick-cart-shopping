/**
 * Multi-Step Checkout - Side Cart Checkout
 *
 * @package Quick Cart Shopping
 * @since 1.0.0
 */

import { DOM } from '../utils/dom.js';
import { ProgressBarRenderer } from '../checkout/ProgressBarRenderer.js';
import { StepNavigator } from '../checkout/StepNavigator.js';
import { CheckoutFormHandler } from '../checkout/CheckoutFormHandler.js';

export class MultiStepCheckout {
  constructor(settings, panelBody) {
    this.settings = settings;
    this.panelBody = panelBody;
    this.currentStep = 0;
    this.steps = [];
    this.isActive = false;
    this.elements = {};
    this.navigator = null;

    this.buildSteps();
  }

  /**
   * Build steps from settings
   * Order: 1. Billing/Shipping → 2. Order Review → 3. Payment
   */
  buildSteps() {
    const { checkout } = this.settings;
    if (!checkout) return;

    const stepConfig = [
      { id: 1, label: checkout.step1Label || 'Billing & Shipping', field: 'billing', enabled: checkout.enableStep1 !== false },
      { id: 2, label: checkout.step2Label || 'Order Review', field: 'review', enabled: checkout.enableStep2 !== false },
      { id: 3, label: checkout.step3Label || 'Payment', field: 'payment', enabled: checkout.enableStep3 !== false }
    ];

    this.steps = stepConfig.filter(step => step.enabled);
  }

  /**
   * Show checkout
   */
  show() {
    if (this.isActive || this.steps.length === 0) return;

    this.isActive = true;
    this.hideCartElements();
    this.createCheckoutContainer();
    this.renderProgressBar();
    this.renderStepContainers();
    this.renderNavigation();
    this.panelBody.appendChild(this.elements.container);
    this.loadStep(this.currentStep);
  }

  /**
   * Hide checkout
   */
  hide() {
    if (!this.isActive) return;

    this.isActive = false;
    DOM.remove(this.elements.container);
    this.showCartElements();
  }

  /**
   * Hide cart elements
   */
  hideCartElements() {
    const selectors = ['.qc-cart-table', '.qc-cart-totals-section', '.qc-cart-empty', '.qc-cart-footer'];
    selectors.forEach(sel => {
      const el = DOM.qs(sel, this.panelBody);
      if (el) el.style.display = 'none';
    });
  }

  /**
   * Show cart elements
   */
  showCartElements() {
    const elements = {
      '.qc-cart-table': 'table',
      '.qc-cart-totals-section': 'block',
      '.qc-cart-empty': 'flex',
      '.qc-cart-footer': 'block'
    };

    Object.entries(elements).forEach(([sel, display]) => {
      const el = DOM.qs(sel, this.panelBody);
      if (el) el.style.display = display;
    });
  }

  /**
   * Create checkout container
   */
  createCheckoutContainer() {
    this.elements.container = DOM.createElement('div', { class: 'qc-checkout-container' });
  }

  /**
   * Render progress bar
   */
  renderProgressBar() {
    this.elements.progress = ProgressBarRenderer.render(this.steps, this.currentStep, this.settings);
    this.elements.container.appendChild(this.elements.progress);
  }

  /**
   * Render step containers
   */
  renderStepContainers() {
    this.steps.forEach((step, index) => {
      const stepDiv = DOM.createElement('div', {
        class: 'qc-step-content',
        'data-step': index,
        style: index === 0 ? '' : 'display: none;'
      });

      stepDiv.innerHTML = `<div class="qc-loading">${this.settings.i18n?.loading || 'Loading...'}</div>`;
      this.elements.container.appendChild(stepDiv);
    });
  }

  /**
   * Render navigation
   */
  renderNavigation() {
    this.navigator = new StepNavigator(this.elements.container, this.steps, this.settings, {
      onBack: () => this.hide(),
      onPrevious: () => this.previousStep(),
      onNext: () => this.nextStep(),
      onSubmit: () => this.submitOrder()
    });

    this.elements.nav = this.navigator.render();
  }

  /**
   * Load step content
   */
  async loadStep(index) {
    const step = this.steps[index];
    if (!step) return;

    const stepDiv = DOM.qs(`[data-step="${index}"]`, this.elements.container);
    if (!stepDiv) return;

    try {
      const response = await fetch(this.settings.meta.ajaxUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          action: 'qc_get_checkout_fields',
          nonce: this.settings.meta.nonce,
          field_type: step.field
        })
      });

      const result = await response.json();

      if (result.success) {
        stepDiv.innerHTML = result.data;
        CheckoutFormHandler.initStepFields(stepDiv, step.field);
      }
    } catch (error) {
      stepDiv.innerHTML = `<div class="qc-error">Failed to load step</div>`;
    }

    this.navigator.update(this.currentStep);
  }

  /**
   * Next step
   */
  async nextStep() {
    if (this.currentStep >= this.steps.length - 1) return;

    // If moving from billing/shipping step, save the data and update shipping
    const currentStepField = this.steps[this.currentStep].field;
    if (currentStepField === 'billing') {
      const success = await this.saveBillingShippingData();
      if (!success) {
        return; // Don't proceed if validation failed
      }
    }

    this.hideCurrentStep();
    this.currentStep++;
    this.showCurrentStep();
    this.loadStep(this.currentStep);
    this.updateProgressBar();
  }

  /**
   * Previous step
   */
  previousStep() {
    if (this.currentStep <= 0) return;

    this.hideCurrentStep();
    this.currentStep--;
    this.showCurrentStep();
    this.updateProgressBar();
  }

  /**
   * Hide current step
   */
  hideCurrentStep() {
    const current = DOM.qs(`[data-step="${this.currentStep}"]`, this.elements.container);
    if (current) current.style.display = 'none';
  }

  /**
   * Show current step
   */
  showCurrentStep() {
    const current = DOM.qs(`[data-step="${this.currentStep}"]`, this.elements.container);
    if (current) current.style.display = 'block';
  }

  /**
   * Update progress bar
   */
  updateProgressBar() {
    const style = this.settings.checkout?.progressBarStyle || 'style1';
    ProgressBarRenderer.update(this.elements.progress, this.steps, this.currentStep, style);
    this.navigator.update(this.currentStep);
  }

  /**
   * Save billing/shipping data and update shipping methods
   */
  async saveBillingShippingData() {
    const stepDiv = DOM.qs(`[data-step="${this.currentStep}"]`, this.elements.container);
    if (!stepDiv) return false;

    // Collect billing/shipping form data
    const formData = new FormData();
    const inputs = stepDiv.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      if (input.name && input.value) {
        formData.append(input.name, input.value);
      }
    });

    // Validate required fields
    const requiredFields = stepDiv.querySelectorAll('[required]');
    for (const field of requiredFields) {
      if (!field.value || !field.value.trim()) {
        field.focus();
        alert(`Please fill in: ${field.getAttribute('placeholder') || field.name}`);
        return false;
      }
    }

    try {
      // Save to WooCommerce session via AJAX
      const response = await fetch(this.settings.meta.ajaxUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          action: 'qc_save_checkout_address',
          nonce: this.settings.meta.nonce,
          ...Object.fromEntries(formData)
        })
      });

      const result = await response.json();

      if (result.success) {
        // Trigger cart refresh to update shipping methods based on new address
        DOM.trigger(document.body, 'wc_fragments_refreshed');
        return true;
      } else {
        alert(result.data?.message || 'Failed to save address');
        return false;
      }
    } catch (error) {
      console.error('Failed to save billing/shipping data:', error);
      alert('Failed to save address. Please try again.');
      return false;
    }
  }

  /**
   * Submit order
   */
  async submitOrder() {
    this.navigator.setSubmitButtonState(true, 'Processing...');

    try {
      const formData = CheckoutFormHandler.collectFormData(this.elements.container);
      const result = await CheckoutFormHandler.submitCheckout(this.settings, formData);

      if (result.success) {
        window.location.href = result.data.redirect;
      } else {
        alert(result.data.message || 'Checkout failed');
        this.navigator.setSubmitButtonState(false);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      this.navigator.setSubmitButtonState(false);
    }
  }
}
