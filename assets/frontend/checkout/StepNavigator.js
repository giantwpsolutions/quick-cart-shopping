/**
 * Step Navigator for Multi-Step Checkout
 *
 * @package Quick Cart Shopping
 * @since 1.0.0
 */

import { DOM } from '../utils/dom.js';

export class StepNavigator {
  constructor(container, steps, settings, callbacks) {
    this.container = container;
    this.steps = steps;
    this.settings = settings;
    this.currentStep = 0;
    this.callbacks = callbacks;
    this.navElement = null;
  }

  /**
   * Render navigation buttons
   */
  render() {
    const navHTML = `
      <div class="qc-nav">
        <button type="button" class="qc-btn qc-btn-back">${this.settings.i18n?.backToCart || 'Back to Cart'}</button>
        <button type="button" class="qc-btn qc-btn-prev" style="display: none;">${this.settings.i18n?.previous || 'Previous'}</button>
        <button type="button" class="qc-btn qc-btn-next">${this.settings.i18n?.next || 'Next'}</button>
        <button type="button" class="qc-btn qc-btn-submit" style="display: none;">${this.settings.i18n?.placeOrder || 'Place Order'}</button>
      </div>
    `;

    this.navElement = DOM.createFromHTML(navHTML);
    this.container.appendChild(this.navElement);
    this.bindEvents();
    return this.navElement;
  }

  /**
   * Bind navigation button events
   */
  bindEvents() {
    DOM.on(DOM.qs('.qc-btn-back', this.navElement), 'click', () => {
      if (this.callbacks.onBack) this.callbacks.onBack();
    });

    DOM.on(DOM.qs('.qc-btn-prev', this.navElement), 'click', () => {
      if (this.callbacks.onPrevious) this.callbacks.onPrevious();
    });

    DOM.on(DOM.qs('.qc-btn-next', this.navElement), 'click', () => {
      if (this.callbacks.onNext) this.callbacks.onNext();
    });

    DOM.on(DOM.qs('.qc-btn-submit', this.navElement), 'click', () => {
      if (this.callbacks.onSubmit) this.callbacks.onSubmit();
    });
  }

  /**
   * Update navigation button visibility
   */
  update(currentStep) {
    this.currentStep = currentStep;

    const prevBtn = DOM.qs('.qc-btn-prev', this.navElement);
    const nextBtn = DOM.qs('.qc-btn-next', this.navElement);
    const submitBtn = DOM.qs('.qc-btn-submit', this.navElement);

    prevBtn.style.display = this.currentStep > 0 ? 'block' : 'none';
    nextBtn.style.display = this.currentStep < this.steps.length - 1 ? 'block' : 'none';
    submitBtn.style.display = this.currentStep === this.steps.length - 1 ? 'block' : 'none';
  }

  /**
   * Set submit button state
   */
  setSubmitButtonState(disabled, text) {
    const submitBtn = DOM.qs('.qc-btn-submit', this.navElement);
    if (submitBtn) {
      submitBtn.disabled = disabled;
      submitBtn.textContent = text || this.settings.i18n?.placeOrder || 'Place Order';
    }
  }
}
