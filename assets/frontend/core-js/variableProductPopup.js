/**
 * Variable Product Popup Handler
 *
 * Shows a modern popup for variable products
 *
 * @package Quick Cart Shopping
 * @since 1.0.0
 */

import { DOM } from '../utils/dom.js';

export class VariableProductPopup {
  constructor(settings) {
    this.settings = settings;
    this.popup = null;
    this.overlay = null;
    this.isOpen = false;
    this.currentProductData = null;

    this.init();
  }

  /**
   * Initialize variable product popup
   */
  init() {
    // Check if variable product popup is enabled
    if (!this.settings.general || !this.settings.general.enableVarProduct) {
      return;
    }

    // Create popup structure immediately for faster display
    this.createPopup();

    this.bindEvents();
  }

  /**
   * Bind events for variable products
   */
  bindEvents() {
    // Handle clicks on variable product items (image, title, button)
    document.body.addEventListener('click', (e) => {
      // Check if clicked on variable product button
      const button = e.target.closest('.product_type_variable');

      // Check if clicked on product item container
      const productItem = e.target.closest('.product, .product-item, li.product, .woocommerce ul.products li.product');

      if (button) {
        // Prevent default action immediately
        e.preventDefault();
        e.stopPropagation();

        this.handleVariableProductClick(button);
        return;
      }

      // If clicked on product image or title within a variable product
      if (productItem) {
        // Check if this product has a variable product button
        const variableButton = productItem.querySelector('.product_type_variable');

        if (variableButton) {
          // Check if clicked on image or title
          const isImageOrTitle = e.target.closest('.woocommerce-loop-product__link, .attachment-woocommerce_thumbnail, img, h2, h3, .woocommerce-loop-product__title');

          if (isImageOrTitle) {
            // Prevent default action
            e.preventDefault();
            e.stopPropagation();

            this.handleVariableProductClick(variableButton);
          }
        }
      }
    }, true); // Use capture phase
  }

  /**
   * Handle variable product click
   * @param {HTMLElement} button
   */
  async handleVariableProductClick(button) {
    let productId = button.getAttribute('data-product_id');

    // Try alternate attribute names
    if (!productId) {
      productId = button.getAttribute('data-product-id');
    }

    // Try getting from link href
    if (!productId) {
      const href = button.getAttribute('href');
      if (href) {
        const match = href.match(/add-to-cart=(\d+)/);
        if (match) {
          productId = match[1];
        }
      }
    }

    if (!productId) {
      return;
    }

    // Show popup immediately with loading state
    this.openWithLoading();

    // Fetch product data
    await this.fetchProductData(productId);

    // Populate with actual data or show error
    if (this.currentProductData) {
      this.populatePopup();
    } else {
      this.close();
    }
  }

  /**
   * Fetch product data via AJAX
   * @param {number} productId
   */
  async fetchProductData(productId) {
    const ajaxUrl = this.settings.meta?.ajaxUrl;
    const nonce = this.settings.meta?.nonce;

    if (!ajaxUrl || !nonce) {
      return;
    }

    try {
      const response = await fetch(ajaxUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'qc_get_variable_product',
          nonce: nonce,
          product_id: productId
        })
      });

      const result = await response.json();

      if (result.success && result.data) {
        this.currentProductData = result.data;
      }
    } catch (error) {
      console.error('[VP Popup] Failed to fetch product data:', error);
    }
  }

  /**
   * Open popup with loading state (instant display)
   */
  openWithLoading() {
    if (this.isOpen) {
      return;
    }

    // Show loading state
    const content = DOM.qs('.qc-variable-content', this.popup);
    if (content) {
      content.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 400px;">
          <div style="text-align: center;">
            <div style="width: 56px; height: 56px; border: 4px solid #f0f0f0; border-top: 4px solid #05291B; border-radius: 50%; animation: qcSpin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite; margin: 0 auto 20px;"></div>
            <p style="color: #666; font-size: 15px; font-weight: 500; margin: 0;">Loading product options...</p>
          </div>
        </div>
        <style>
          @keyframes qcSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
    }

    this.isOpen = true;
    DOM.addClass(this.overlay, 'qc-active');
    DOM.addClass(this.popup, 'qc-active');
    document.body.style.overflow = 'hidden';

    // Trigger open event
    DOM.trigger(document, 'qc:variable:popup:opened');
  }

  /**
   * Open popup
   */
  open() {
    if (this.isOpen || !this.currentProductData) {
      return;
    }

    // Populate with product data
    this.populatePopup();

    this.isOpen = true;
    DOM.addClass(this.overlay, 'qc-active');
    DOM.addClass(this.popup, 'qc-active');
    document.body.style.overflow = 'hidden';

    // Trigger open event
    DOM.trigger(document, 'qc:variable:popup:opened');
  }

  /**
   * Close popup
   */
  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    DOM.removeClass(this.overlay, 'qc-active');
    DOM.removeClass(this.popup, 'qc-active');
    document.body.style.overflow = '';

    // Trigger close event
    DOM.trigger(document, 'qc:variable:popup:closed');
  }

  /**
   * Create popup structure
   */
  createPopup() {
    // Create overlay
    this.overlay = DOM.createElement('div', {
      class: 'qc-variable-overlay'
    });
    DOM.on(this.overlay, 'click', () => this.close());
    document.body.appendChild(this.overlay);

    // Create popup
    this.popup = DOM.createElement('div', {
      class: 'qc-variable-popup',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Product Options'
    });

    // Close button
    const closeBtn = DOM.createElement('button', {
      class: 'qc-variable-close',
      'aria-label': 'Close',
      type: 'button'
    });
    closeBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    DOM.on(closeBtn, 'click', () => this.close());
    this.popup.appendChild(closeBtn);

    // Product content container
    const content = DOM.createElement('div', {
      class: 'qc-variable-content'
    });
    this.popup.appendChild(content);

    document.body.appendChild(this.popup);

    // ESC key to close
    DOM.on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  /**
   * Populate popup with product data
   */
  populatePopup() {
    const content = DOM.qs('.qc-variable-content', this.popup);
    if (!content || !this.currentProductData) return;

    const { product } = this.currentProductData;

    // Build gallery HTML
    const galleryImages = product.gallery_images || [];
    let galleryHTML = '';

    // Show gallery if we have images, otherwise fallback to main image
    if (galleryImages.length >= 1) {
      galleryHTML = `
        <div class="qc-variable-gallery">
          <div class="qc-gallery-main">
            <img src="${galleryImages[0].url}" alt="${product.name}" class="qc-gallery-main-image">
          </div>
          ${galleryImages.length > 1 ? `
          <div class="qc-gallery-thumbs">
            ${galleryImages.map((img, index) => `
              <div class="qc-gallery-thumb ${index === 0 ? 'active' : ''}" data-index="${index}">
                <img src="${img.url}" alt="${product.name}">
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
      `;
    } else if (product.image) {
      galleryHTML = `
        <div class="qc-variable-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
      `;
    } else {
      galleryHTML = `
        <div class="qc-variable-image">
          <img src="${this.settings.meta?.placeholderImage || ''}" alt="${product.name}">
        </div>
      `;
    }

    content.innerHTML = `
      <div class="qc-variable-product">
        ${galleryHTML}
        <div class="qc-variable-details">
          <h2 class="qc-variable-title">${product.name}</h2>
          <div class="qc-variable-price">${product.price}</div>
          ${product.short_description ? `<div class="qc-variable-description">${product.short_description}</div>` : ''}
          <div class="qc-variable-form">
            ${product.variations_form}
          </div>
        </div>
      </div>
    `;

    // Bind gallery thumbnail clicks
    if (galleryImages.length > 1) {
      this.bindGalleryEvents();
    }

    // IMMEDIATELY bind our handler BEFORE WooCommerce initializes
    this.bindFormSubmit();

    // Check if jQuery is available
    if (typeof window.jQuery === 'undefined') {
      console.error('[VP Popup] jQuery not available');
      return;
    }

    // Use DELEGATED jQuery event binding (same technique as Instantio)
    window.jQuery(document).off('click.qcVariablePopup', '.qc-variable-form .single_add_to_cart_button');
    window.jQuery(document).on('click.qcVariablePopup', '.qc-variable-form .single_add_to_cart_button', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const form = window.jQuery(e.target).closest('form.variations_form')[0];
      if (form) {
        this.handleAddToCart(form);
      }
      return false;
    });

    // THEN initialize WooCommerce variation scripts if available
    if (typeof window.jQuery.fn.wc_variation_form !== 'undefined') {
      const $form = window.jQuery('.qc-variable-form form.variations_form');
      $form.wc_variation_form();
    } else {
      console.warn('[VP Popup] WooCommerce variation form script not available');
    }
  }

  /**
   * Bind form submit to handle add to cart via AJAX
   */
  bindFormSubmit() {
    const form = DOM.qs('form.variations_form', this.popup);
    if (!form) {
      console.error('[VP Popup] Form not found in popup');
      return;
    }

    // Remove the form's action to prevent redirect
    form.removeAttribute('action');
    form.setAttribute('action', 'javascript:void(0);');

    // Find the add to cart button
    const addToCartBtn = form.querySelector('.single_add_to_cart_button');
    if (!addToCartBtn) {
      console.error('[VP Popup] Add to cart button not found');
      return;
    }

    // Bind to button click with capture phase
    const clickHandler = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      await this.handleAddToCart(form);
      return false;
    };

    addToCartBtn.addEventListener('click', clickHandler, true);

    // Also bind to form submit as backup
    const submitHandler = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      await this.handleAddToCart(form);
      return false;
    };

    form.addEventListener('submit', submitHandler, true);
  }

  /**
   * Handle add to cart action
   */
  async handleAddToCart(form) {
    const addToCartBtn = DOM.qs('.single_add_to_cart_button', form);
    if (!addToCartBtn) {
      console.warn('[VP Popup] Add to cart button not found');
      return false;
    }

    // Get product ID and variation ID
    const productId = DOM.qs('input[name="product_id"]', form);
    const variationId = DOM.qs('input[name="variation_id"]', form);

    if (!productId || !productId.value) {
      console.warn('[VP Popup] Product ID not found');
      return false;
    }

    // If no variation selected, don't proceed
    if (!variationId || !variationId.value || variationId.value === '0') {
      alert('Please select product options before adding to cart');
      return false;
    }

    // Disable button
    addToCartBtn.disabled = true;
    const originalText = addToCartBtn.textContent;
    addToCartBtn.textContent = 'Adding...';

    try {
      const ajaxUrl = this.settings.meta?.ajaxUrl;

      if (!ajaxUrl) {
        throw new Error('AJAX URL not found');
      }

      // Build form data
      const formData = new URLSearchParams();
      formData.append('action', 'woocommerce_ajax_add_to_cart');
      formData.append('product_id', productId.value);
      formData.append('variation_id', variationId.value);
      formData.append('quantity', form.querySelector('input[name="quantity"]')?.value || 1);

      // Add variation attributes
      const attributes = form.querySelectorAll('select[name^="attribute_"]');
      attributes.forEach(attr => {
        formData.append(attr.name, attr.value);
      });

      const response = await fetch(ajaxUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      const result = await response.json();

      if (result.success || result.fragments) {
        // Success
        addToCartBtn.textContent = 'Added!';

        // Update cart fragments
        if (result.fragments && typeof jQuery !== 'undefined') {
          jQuery.each(result.fragments, function(key, value) {
            jQuery(key).replaceWith(value);
          });
        }

        // Trigger WooCommerce cart update events
        if (typeof jQuery !== 'undefined') {
          jQuery(document.body).trigger('wc_fragment_refresh');
          jQuery(document.body).trigger('added_to_cart', [result.fragments, result.cart_hash]);
        }

        // Trigger our custom event to update Quick Cart
        DOM.trigger(document.body, 'added_to_cart');

        // Close popup after short delay
        setTimeout(() => {
          this.close();
          addToCartBtn.textContent = originalText;
          addToCartBtn.disabled = false;
        }, 1000);
      } else {
        throw new Error(result.error || 'Add to cart failed');
      }
    } catch (error) {
      console.error('[VP Popup] Add to cart failed:', error);
      alert('Failed to add product to cart: ' + error.message);
      addToCartBtn.textContent = originalText;
      addToCartBtn.disabled = false;
    }
  }

  /**
   * Bind gallery thumbnail events
   */
  bindGalleryEvents() {
    const thumbs = this.popup.querySelectorAll('.qc-gallery-thumb');
    const mainImage = this.popup.querySelector('.qc-gallery-main-image');
    const galleryImages = this.currentProductData.product.gallery_images || [];

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        // Update active thumb
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        // Update main image
        if (mainImage && galleryImages[index]) {
          mainImage.src = galleryImages[index].url;
        }
      });
    });
  }

  /**
   * Destroy popup
   */
  destroy() {
    if (this.popup) {
      DOM.remove(this.popup);
      this.popup = null;
    }
    if (this.overlay) {
      DOM.remove(this.overlay);
      this.overlay = null;
    }
  }
}
