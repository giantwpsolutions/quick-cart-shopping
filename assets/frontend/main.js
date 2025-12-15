/**
 * Quick Cart Shopping - Frontend Entry Point
 *
 * @package Quick Cart Shopping
 * @since 1.0.0
 */

import { DOM } from './utils/dom.js';
import { CartToggle } from './core-js/cartToggle.js';

class QuickCartShopping {
  constructor() {
    this.settings = window.qcShoppingData || {};
    this.cartToggle = null;

    // Debug: Always initialize for now
    // if (!this.settings.general || !this.settings.general.enableQuickCart) {
    //   console.warn('Quick Cart Shopping is disabled');
    //   return;
    // }

    this.init();
  }

  /**
   * Initialize the plugin
   */
  init() {
    DOM.ready(() => {
      this.initCartToggle();
      this.bindGlobalEvents();
    });
  }

  /**
   * Initialize cart toggle button
   */
  initCartToggle() {
    if (!this.settings.toggle) {
      console.warn('Toggle settings not found');
      return;
    }

    this.cartToggle = new CartToggle(this.settings);
  }

  /**
   * Bind global events
   */
  bindGlobalEvents() {
    // Listen for cart toggle events
    DOM.on(document, 'qc:cart:toggle', () => {
      // TODO: Open/close cart drawer
    });

    // TODO: Uncomment below for automatic WooCommerce cart integration
    /*
    // Listen for add to cart events (WooCommerce)
    DOM.on(document.body, 'added_to_cart', (e) => {
      this.handleAddToCart(e.detail);
    });

    // Listen for cart removal events
    DOM.on(document.body, 'removed_from_cart', () => {
      this.handleCartUpdate();
    });

    // Listen for cart fragments refresh
    DOM.on(document.body, 'wc_fragments_refreshed', () => {
      this.handleCartUpdate();
    });

    // Listen for cart updated event
    DOM.on(document.body, 'updated_wc_div', () => {
      this.handleCartUpdate();
    });

    // Initial cart count on load
    this.updateInitialCartCount();
    */
  }

  /**
   * Handle add to cart event
   * @param {Object} data - Cart data from WooCommerce
   */
  handleAddToCart(data) {
    // Get cart count from WooCommerce fragments
    const cartCount = this.getCartCountFromFragments();

    // Update cart toggle badge
    if (this.cartToggle) {
      this.cartToggle.updateCartCount(cartCount);
    }

    // Trigger custom event
    DOM.trigger(document, 'qc:cart:updated', {
      count: cartCount,
      data: data
    });
  }

  /**
   * Update initial cart count on page load
   */
  updateInitialCartCount() {
    const count = this.getCartCountFromFragments();
    if (this.cartToggle) {
      this.cartToggle.updateCartCount(count);
    }
  }

  /**
   * Handle general cart update
   */
  handleCartUpdate() {
    const count = this.getCartCountFromFragments();
    if (this.cartToggle) {
      this.cartToggle.updateCartCount(count);
    }

    // Trigger custom event
    DOM.trigger(document, 'qc:cart:updated', {
      count: count
    });
  }

  /**
   * Get cart count from WooCommerce fragments
   * @returns {number}
   */
  getCartCountFromFragments() {
    let count = 0;

    // Method 1: Try to get from WooCommerce cart fragments in sessionStorage
    if (window.wc_cart_fragments_params && window.wc_cart_fragments_params.cart_hash) {
      const fragmentKey = 'wc_fragments_' + window.wc_cart_fragments_params.cart_hash;
      const fragments = sessionStorage.getItem(fragmentKey);

      if (fragments) {
        try {
          const data = JSON.parse(fragments);

          // Try to extract from cart count element
          if (data['.cart-count'] || data['span.cart-count']) {
            const countElement = data['.cart-count'] || data['span.cart-count'];
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = countElement;
            const countText = tempDiv.textContent.trim();
            count = parseInt(countText, 10) || 0;
            if (count > 0) return count;
          }

          // Try to extract from widget shopping cart content
          if (data['div.widget_shopping_cart_content']) {
            const widgetContent = data['div.widget_shopping_cart_content'];
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = widgetContent;
            const items = tempDiv.querySelectorAll('.cart_list .cart_list_product_item, .woocommerce-mini-cart-item');
            count = items.length;
            if (count > 0) return count;
          }

          // Try to parse from item count text
          const countMatch = JSON.stringify(data).match(/(\d+)\s+item/i);
          if (countMatch) {
            count = parseInt(countMatch[1], 10);
            if (count > 0) return count;
          }
        } catch (e) {
          console.warn('Failed to parse cart fragments:', e);
        }
      }
    }

    // Method 2: Try to get from DOM cart count elements
    const cartCountSelectors = [
      '.cart-contents .count',
      '.cart-contents-count',
      '.cart-count',
      'span.count',
      '.woocommerce-mini-cart__total .count'
    ];

    for (const selector of cartCountSelectors) {
      const element = DOM.qs(selector);
      if (element) {
        const countText = element.textContent.trim();
        count = parseInt(countText, 10) || 0;
        if (count > 0) return count;
      }
    }

    // Method 3: Try to get from cart widget in DOM
    const cartWidget = DOM.qs('.widget_shopping_cart .cart_list, .woocommerce-mini-cart');
    if (cartWidget) {
      const items = cartWidget.querySelectorAll('.cart_list_product_item, .woocommerce-mini-cart-item');
      count = items.length;
      if (count > 0) return count;
    }

    // Method 4: Try AJAX request to get cart count from WooCommerce
    this.fetchCartCountFromAjax();

    return count;
  }

  /**
   * Fetch cart count via AJAX from WooCommerce
   */
  fetchCartCountFromAjax() {
    if (!window.wc_cart_fragments_params) {
      return;
    }

    const ajaxUrl = window.wc_cart_fragments_params.wc_ajax_url?.toString().replace('%%endpoint%%', 'get_refreshed_fragments');

    if (ajaxUrl) {
      fetch(ajaxUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data && data.fragments) {
          // Store fragments in sessionStorage
          if (window.wc_cart_fragments_params.cart_hash) {
            sessionStorage.setItem(
              'wc_fragments_' + window.wc_cart_fragments_params.cart_hash,
              JSON.stringify(data.fragments)
            );
          }

          // Update cart count
          this.handleCartUpdate();
        }
      })
      .catch(error => {
        console.warn('Failed to fetch cart count:', error);
      });
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new QuickCartShopping();
  });
} else {
  new QuickCartShopping();
}
