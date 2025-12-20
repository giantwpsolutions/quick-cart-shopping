/**
 * Checkout Form Handler
 *
 * @package Quick Cart Shopping
 * @since 1.0.0
 */

import { DOM } from '../utils/dom.js';

export class CheckoutFormHandler {
  /**
   * Collect form data from inputs
   *
   * @param {HTMLElement} container - Container element
   * @returns {object} Form data object
   */
  static collectFormData(container) {
    const formData = {};
    const inputs = DOM.qsa('input, select, textarea', container);

    inputs.forEach(input => {
      if (input.name) {
        if (input.type === 'checkbox' || input.type === 'radio') {
          if (input.checked) {
            formData[input.name] = input.value;
          }
        } else if (input.value) {
          formData[input.name] = input.value;
        }
      }
    });

    return formData;
  }

  /**
   * Initialize billing/shipping fields
   *
   * @param {HTMLElement} stepDiv - Step container element
   * @param {string} fieldType - Type of fields (billing, payment, review)
   */
  static initStepFields(stepDiv, fieldType) {
    if (fieldType === 'billing') {
      const checkbox = DOM.qs('#ship-to-different-address-checkbox', stepDiv);
      const shippingFields = DOM.qs('.shipping_address', stepDiv);

      if (checkbox && shippingFields) {
        DOM.on(checkbox, 'change', () => {
          shippingFields.style.display = checkbox.checked ? 'block' : 'none';
        });
      }
    }
  }

  /**
   * Submit checkout form
   *
   * @param {object} settings - Settings object
   * @param {object} formData - Form data to submit
   * @returns {Promise} Promise with submission result
   */
  static async submitCheckout(settings, formData) {
    const response = await fetch(settings.meta.ajaxUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        action: 'qc_process_checkout',
        nonce: settings.meta.nonce,
        ...formData
      })
    });

    return await response.json();
  }
}
