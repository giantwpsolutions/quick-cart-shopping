/**
 * Drag to Cart - Drag products from shop to cart icon
 *
 * @package Quick Cart Shopping
 * @since 1.0.0
 */

import { DOM } from '../utils/dom.js';

export class DragToCart {
  constructor(settings) {
    this.settings = settings;
    this.draggedProductId = null;
    this.draggedProductType = null;
    this.variableProductHandler = null;

    this.init();
  }

  /**
   * Initialize drag to cart
   */
  init() {
    // Check if drag and drop is enabled
    if (!this.settings.general?.enableDragAndDrop) {
      return;
    }

    // Wait for DOM to be ready
    DOM.ready(() => {
      this.makeProductsDraggable();
      this.makeCartToggleDrop();
    });
  }

  /**
   * Set variable product handler reference
   */
  setVariableProductHandler(handler) {
    this.variableProductHandler = handler;
  }

  /**
   * Make all products on the page draggable
   */
  makeProductsDraggable() {
    // Find all product items
    const productSelectors = [
      '.product',
      '.product-item',
      'li.product',
      '.woocommerce ul.products li.product'
    ];

    productSelectors.forEach(selector => {
      const products = document.querySelectorAll(selector);
      products.forEach(product => {
        // Skip if already made draggable
        if (product.getAttribute('draggable') === 'true') {
          return;
        }

        // Make product draggable
        product.setAttribute('draggable', 'true');
        product.style.cursor = 'grab';

        // Bind drag events
        this.bindProductDragEvents(product);
      });
    });
  }

  /**
   * Bind drag events to a product
   */
  bindProductDragEvents(product) {
    // Dragstart
    DOM.on(product, 'dragstart', (e) => {
      product.style.cursor = 'grabbing';
      product.style.opacity = '0.5';

      // Get product ID and type
      const productId = this.getProductId(product);
      const productType = this.getProductType(product);

      this.draggedProductId = productId;
      this.draggedProductType = productType;

      // Set data for drag
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('text/plain', productId);
    });

    // Dragend
    DOM.on(product, 'dragend', (e) => {
      product.style.cursor = 'grab';
      product.style.opacity = '1';
      this.draggedProductId = null;
      this.draggedProductType = null;
    });
  }

  /**
   * Make cart toggle icon accept drops
   */
  makeCartToggleDrop() {
    const cartToggle = document.querySelector('.qc-cart-toggle');
    if (!cartToggle) {
      return;
    }

    // Dragover - allow drop
    DOM.on(cartToggle, 'dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      DOM.addClass(cartToggle, 'qc-drop-active');
    });

    // Dragleave
    DOM.on(cartToggle, 'dragleave', (e) => {
      DOM.removeClass(cartToggle, 'qc-drop-active');
    });

    // Drop - add product to cart
    DOM.on(cartToggle, 'drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      DOM.removeClass(cartToggle, 'qc-drop-active');

      if (this.draggedProductId) {
        this.handleProductDrop(this.draggedProductId, this.draggedProductType);
      }
    });
  }

  /**
   * Handle product drop on cart icon
   */
  async handleProductDrop(productId, productType) {
    if (!productId) {
      return;
    }

    // Check if variable product
    if (productType === 'variable') {
      // Check if variable popup is enabled
      if (this.settings.general?.enableVarProduct && this.variableProductHandler) {
        // Open variable product popup
        this.openVariablePopup(productId);
      } else {
        // Add first variation to cart
        await this.addFirstVariationToCart(productId);
      }
    } else {
      // Simple product - add directly to cart
      await this.addSimpleProductToCart(productId);
    }
  }

  /**
   * Open variable product popup
   */
  openVariablePopup(productId) {
    if (!this.variableProductHandler) {
      console.warn('[Drag to Cart] Variable product handler not available');
      return;
    }

    // Create a fake button element to trigger the variable product handler
    const fakeButton = document.createElement('a');
    fakeButton.setAttribute('data-product_id', productId);
    fakeButton.href = `?add-to-cart=${productId}`;
    fakeButton.classList.add('product_type_variable');

    // Trigger the variable product handler
    this.variableProductHandler.handleVariableProductClick(fakeButton);
  }

  /**
   * Add first variation to cart (when popup is disabled)
   */
  async addFirstVariationToCart(productId) {
    const ajaxUrl = this.settings.meta?.ajaxUrl;
    const nonce = this.settings.meta?.nonce;

    if (!ajaxUrl || !nonce) {
      return;
    }

    try {
      // First, get product data to find first variation
      const response = await fetch(ajaxUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'qcshopping_get_variable_product',
          nonce: nonce,
          product_id: productId
        })
      });

      const result = await response.json();

      if (result.success && result.data?.product) {
        // Get first available variation
        const variations = this.extractVariationsFromForm(result.data.product.variations_form);

        if (variations && variations.length > 0) {
          const firstVariation = variations[0];

          // Add to cart
          await this.addVariationToCart(productId, firstVariation.variation_id, firstVariation.attributes);
        } else {
          alert('No variations available for this product');
        }
      }
    } catch (error) {
      console.error('[Drag to Cart] Failed to add variation:', error);
      alert('Failed to add product to cart');
    }
  }

  /**
   * Extract variations from WooCommerce form HTML
   */
  extractVariationsFromForm(formHtml) {
    // Parse the HTML to find variation data
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formHtml;

    // Look for variation data in script tag or data attributes
    const variationScript = tempDiv.querySelector('.variations_form');

    if (variationScript) {
      // Try to get variations data from WooCommerce
      const dataElement = tempDiv.querySelector('[data-product_variations]');
      if (dataElement) {
        try {
          const variationsData = JSON.parse(dataElement.getAttribute('data-product_variations'));
          return variationsData;
        } catch (e) {
          console.warn('[Drag to Cart] Failed to parse variations data');
        }
      }
    }

    return null;
  }

  /**
   * Add variation to cart
   */
  async addVariationToCart(productId, variationId, attributes) {
    const ajaxUrl = this.settings.meta?.ajaxUrl;
    const nonce = this.settings.meta?.nonce;

    if (!ajaxUrl) {
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('action', 'qcshopping_add_to_cart');
      formData.append('nonce', nonce);
      formData.append('product_id', productId);
      formData.append('variation_id', variationId);
      formData.append('quantity', 1);

      // Add attributes
      if (attributes) {
        Object.keys(attributes).forEach(key => {
          formData.append(key, attributes[key]);
        });
      }

      const response = await fetch(ajaxUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      const result = await response.json();

      if (result.success || result.fragments) {
        // Trigger cart update
        DOM.trigger(document.body, 'added_to_cart');

        // Show success feedback
        this.showSuccessFeedback();
      } else {
        alert('Failed to add product to cart');
      }
    } catch (error) {
      console.error('[Drag to Cart] Failed to add to cart:', error);
      alert('Failed to add product to cart');
    }
  }

  /**
   * Add simple product to cart
   */
  async addSimpleProductToCart(productId) {
    const ajaxUrl = this.settings.meta?.ajaxUrl;

    if (!ajaxUrl) {
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('action', 'qcshopping_add_to_cart');
      formData.append('product_id', productId);
      formData.append('quantity', 1);

      const response = await fetch(ajaxUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      const result = await response.json();

      if (result.error) {
        alert(result.error);
      } else {
        // Trigger cart update
        DOM.trigger(document.body, 'added_to_cart');

        // Show success feedback
        this.showSuccessFeedback();
      }
    } catch (error) {
      console.error('[Drag to Cart] Failed to add simple product:', error);
      alert('Failed to add product to cart');
    }
  }

  /**
   * Show success feedback
   */
  showSuccessFeedback() {
    const cartToggle = document.querySelector('.qc-cart-toggle');
    if (cartToggle) {
      DOM.addClass(cartToggle, 'qc-cart-added');
      setTimeout(() => {
        DOM.removeClass(cartToggle, 'qc-cart-added');
      }, 1000);
    }
  }

  /**
   * Get product ID from product element
   */
  getProductId(product) {
    // Try multiple methods to get product ID

    // Method 1: From add to cart button
    const addToCartBtn = product.querySelector('.add_to_cart_button, .product_type_simple, .product_type_variable');
    if (addToCartBtn) {
      const productId = addToCartBtn.getAttribute('data-product_id');
      if (productId) return productId;

      // Try from href
      const href = addToCartBtn.getAttribute('href');
      if (href) {
        const match = href.match(/add-to-cart=(\d+)/);
        if (match) return match[1];
      }
    }

    // Method 2: From product element itself
    const productIdAttr = product.getAttribute('data-product-id') || product.getAttribute('data-product_id');
    if (productIdAttr) return productIdAttr;

    // Method 3: From class name
    const classes = product.className;
    const match = classes.match(/post-(\d+)/);
    if (match) return match[1];

    return null;
  }

  /**
   * Get product type (simple, variable, etc.)
   */
  getProductType(product) {
    const addToCartBtn = product.querySelector('.add_to_cart_button, .product_type_simple, .product_type_variable');

    if (addToCartBtn) {
      if (addToCartBtn.classList.contains('product_type_variable')) {
        return 'variable';
      }
      if (addToCartBtn.classList.contains('product_type_simple')) {
        return 'simple';
      }
    }

    return 'simple'; // Default to simple
  }
}
