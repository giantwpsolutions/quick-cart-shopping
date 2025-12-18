/**
 * Add to Cart Handler
 *
 * @package Quick Cart Shopping
 * @since 1.0.0
 */

import { DOM } from '../utils/dom.js';

export class AddToCartHandler {
  constructor() {
    this.init();
  }

  /**
   * Initialize add to cart handler
   */
  init() {
    this.bindAddToCartButtons();
  }

  /**
   * Bind add to cart buttons
   */
  bindAddToCartButtons() {
    // Handle all add to cart forms
    DOM.on(document.body, 'submit', (e) => {
      const form = e.target.closest('form.cart');
      if (!form) return;

      const addToCartBtn = DOM.qs('button[type="submit"][name="add-to-cart"]', form);
      if (!addToCartBtn) {
        return; // Not an add to cart form
      }

      e.preventDefault();
      this.handleAddToCart(form);
    });

    // Handle simple add to cart buttons (shop page)
    DOM.on(document.body, 'click', (e) => {
      const button = e.target.closest('.add_to_cart_button:not(.product_type_variable)');
      if (!button) return;

      e.preventDefault();
      this.handleSimpleAddToCart(button);
    });
  }

  /**
   * Handle add to cart form submission
   * @param {HTMLFormElement} form
   */
  handleAddToCart(form) {
    const formData = new FormData(form);
    const productId = formData.get('add-to-cart') || formData.get('product_id');
    const quantity = formData.get('quantity') || 1;
    const variationId = formData.get('variation_id') || 0;

    if (!productId) {
      return;
    }

    this.addToCart({
      product_id: productId,
      quantity: quantity,
      variation_id: variationId
    });
  }

  /**
   * Handle simple add to cart button
   * @param {HTMLElement} button
   */
  handleSimpleAddToCart(button) {
    const productId = button.getAttribute('data-product_id');
    const quantity = button.getAttribute('data-quantity') || 1;

    if (!productId) {
      return;
    }

    // Add loading state
    button.classList.add('loading');

    this.addToCart({
      product_id: productId,
      quantity: quantity
    }, button);
  }

  /**
   * Add product to cart via AJAX
   * @param {Object} data
   * @param {HTMLElement} button
   */
  addToCart(data, button = null) {
    const ajaxUrl = window.wc_add_to_cart_params?.wc_ajax_url?.toString().replace('%%endpoint%%', 'add_to_cart')
                    || window.wc_add_to_cart_params?.ajax_url;

    if (!ajaxUrl) {
      console.warn('WooCommerce AJAX URL not found');
      return;
    }

    const formData = new URLSearchParams({
      action: 'woocommerce_add_to_cart',
      ...data
    });

    fetch(ajaxUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    })
    .then(response => response.json())
    .then(result => {
      if (button) {
        button.classList.remove('loading');
        button.classList.add('added');
      }

      // Trigger WooCommerce added_to_cart event
      DOM.trigger(document.body, 'added_to_cart', [result.fragments, result.cart_hash, button]);

      // Also trigger our custom event
      DOM.trigger(document, 'qc:product:added', {
        productId: data.product_id,
        quantity: data.quantity
      });
    })
    .catch(error => {
      console.warn('Failed to add to cart:', error);
      if (button) {
        button.classList.remove('loading');
      }
    });
  }
}
