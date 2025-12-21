/**
 * Cart Panel Component
 *
 * @package Quick Cart Shopping
 * @since 1.0.0
 */

import { DOM } from '../utils/dom.js';

export class CartPanel {
  constructor(settings) {
    this.settings = settings;
    this.panel = null;
    this.overlay = null;
    this.isOpen = false;
    this.cartItems = [];
    this.draggedItem = null; // Store dragged item reference
    this.multiStepCheckout = null; // Will be initialized if Pro is active

    this.init();
  }

  /**
   * Initialize cart panel
   */
  init() {
    this.render();
    this.bindEvents();
  }

  /**
   * Render panel and overlay
   */
  render() {
    const { layout, cart } = this.settings;

    // Create overlay
    this.overlay = DOM.createElement('div', {
      class: 'qc-cart-overlay',
      'aria-hidden': 'true'
    });
    document.body.appendChild(this.overlay);

    // Create panel container
    const panelClasses = [
      'qc-cart-panel',
      `qc-cart-${layout.cartOption}`, // side or popup
      `qc-animation-${layout.animation}` // slide, fade, etc.
    ];

    this.panel = DOM.createElement('div', {
      class: panelClasses.join(' '),
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Shopping Cart'
    });

    // Set panel width
    if (layout.cartOption === 'side') {
      this.panel.style.width = `${layout.cartWidth}px`;
    } else if (layout.cartOption === 'popup') {
      this.panel.style.maxWidth = `${layout.cartWidth}px`;
    }

    // Panel header
    const header = this.createHeader();
    this.panel.appendChild(header);

    // Panel body (cart items)
    const body = this.createBody();
    this.panel.appendChild(body);

    // Panel footer (totals and checkout)
    const footer = this.createFooter();
    this.panel.appendChild(footer);

    document.body.appendChild(this.panel);

    // Initialize Pro checkout if available
    this.initProCheckout(body);

    // Bind checkout button click handler
    this.bindCheckoutButton();
  }

  /**
   * Initialize Pro checkout feature if Pro plugin is active
   * @param {HTMLElement} body Panel body element
   */
  initProCheckout(body) {
    const { general } = this.settings;

    // Function to initialize checkout
    const initCheckout = () => {
      if (window.QCProCheckout?.MultiStepCheckout) {
        this.multiStepCheckout = new window.QCProCheckout.MultiStepCheckout(this.settings, body);
        console.log('[QC] Pro checkout initialized');
      }
    };

    // Check if Pro checkout is available and direct checkout is enabled
    if (general?.enableDirectCheckout) {
      if (window.QCProCheckout?.MultiStepCheckout) {
        // Pro is already loaded
        initCheckout();
      } else {
        // Wait for Pro to load
        console.log('[QC] Waiting for Pro checkout to load...');
        const checkInterval = setInterval(() => {
          if (window.QCProCheckout?.MultiStepCheckout) {
            clearInterval(checkInterval);
            initCheckout();
          }
        }, 100);

        // Stop checking after 3 seconds
        setTimeout(() => clearInterval(checkInterval), 3000);
      }
    }
  }

  /**
   * Create panel header
   * @returns {HTMLElement}
   */
  createHeader() {
    const { i18n } = this.settings;
    const header = DOM.createElement('div', {
      class: 'qc-cart-header'
    });

    // Title
    const title = DOM.createElement('h2', {
      class: 'qc-cart-title'
    }, i18n?.shoppingCart || 'Shopping Cart');

    // Close button
    const closeBtn = DOM.createElement('button', {
      class: 'qc-cart-close',
      'aria-label': i18n?.closeCart || 'Close cart',
      type: 'button'
    });

    closeBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;

    DOM.on(closeBtn, 'click', () => this.close());

    header.appendChild(title);
    header.appendChild(closeBtn);

    return header;
  }

  /**
   * Create panel body
   * @returns {HTMLElement}
   */
  createBody() {
    const { i18n } = this.settings;
    const body = DOM.createElement('div', {
      class: 'qc-cart-body'
    });

    // Empty cart message
    const emptyMsg = DOM.createElement('div', {
      class: 'qc-cart-empty'
    });

    emptyMsg.innerHTML = `
      <div class="qc-cart-empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      </div>
      <p class="qc-cart-empty-text">${i18n?.emptyCartTitle || 'Your cart is empty'}</p>
      <p class="qc-cart-empty-subtext">${i18n?.emptyCartSubtext || 'Add some products to get started!'}</p>
    `;

    body.appendChild(emptyMsg);

    // Cart items table (will be populated dynamically)
    const tableContainer = DOM.createElement('div', {
      class: 'qc-cart-table-wrapper'
    });

    const table = DOM.createElement('table', {
      class: 'qc-cart-table'
    });

    // Table header
    const thead = DOM.createElement('thead', {
      class: 'qc-cart-thead'
    });
    thead.innerHTML = `
      <tr class="qc-cart-header-row">
        <th class="qc-cart-th qc-cart-th-product">${i18n?.product || 'Product'}</th>
        <th class="qc-cart-th qc-cart-th-price">${i18n?.price || 'Price'}</th>
        <th class="qc-cart-th qc-cart-th-quantity">${i18n?.quantity || 'Quantity'}</th>
        <th class="qc-cart-th qc-cart-th-subtotal">${i18n?.subtotal || 'Subtotal'}</th>
        <th class="qc-cart-th qc-cart-th-remove"></th>
      </tr>
    `;
    table.appendChild(thead);

    // Table body (items will be added here)
    const tbody = DOM.createElement('tbody', {
      class: 'qc-cart-tbody'
    });
    table.appendChild(tbody);

    tableContainer.appendChild(table);
    body.appendChild(tableContainer);

    // Add totals section (coupon, subtotal, shipping, total) - will be shown/hidden with cart items
    const totalsSection = this.createTotalsSection();
    totalsSection.style.display = 'none'; // Hidden initially
    body.appendChild(totalsSection);

    return body;
  }

  /**
   * Create panel footer
   * @returns {HTMLElement}
   */
  createFooter() {
    const { cart, i18n, meta } = this.settings;
    const footer = DOM.createElement('div', {
      class: 'qc-cart-footer'
    });

    // Button container for proper layout
    const buttonContainer = DOM.createElement('div', {
      class: 'qc-cart-footer-buttons'
    });

    // View Cart button
    const viewCartBtn = DOM.createElement('button', {
      class: 'qc-cart-view-btn',
      type: 'button'
    }, i18n?.viewCart || 'View Cart');

    // Checkout button (if enabled)
    if (cart.showCheckoutBtn) {
      const checkoutBtn = DOM.createElement('button', {
        class: 'qc-cart-checkout-btn',
        type: 'button'
      }, i18n?.proceedToCheckout || 'Proceed to Checkout');

      DOM.setStyles(checkoutBtn, {
        backgroundColor: cart.checkoutBtnBgColor,
        color: cart.checkoutBtnTextColor
      });

      buttonContainer.appendChild(viewCartBtn);
      buttonContainer.appendChild(checkoutBtn);

      // Add class for dual-button layout
      buttonContainer.classList.add('qc-dual-buttons');
    } else {
      // Only view cart button - full width
      buttonContainer.appendChild(viewCartBtn);
      buttonContainer.classList.add('qc-single-button');
    }

    footer.appendChild(buttonContainer);

    // Bind View Cart button click
    DOM.on(viewCartBtn, 'click', () => {
      window.location.href = meta?.cartUrl || '/cart';
    });

    return footer;
  }

  /**
   * Create cart totals section (coupon, subtotal, shipping, total)
   * @returns {HTMLElement}
   */
  createTotalsSection() {
    const { cart, i18n } = this.settings;
    const totalsSection = DOM.createElement('div', {
      class: 'qc-cart-totals-section'
    });

    // Coupon field (if enabled)
    if (cart.showCouponField) {
      const couponContainer = DOM.createElement('div', {
        class: 'qc-cart-coupon'
      });
      couponContainer.innerHTML = `
        <input type="text" class="qc-cart-coupon-input" placeholder="${i18n?.couponCode || 'Coupon code'}">
        <button type="button" class="qc-cart-coupon-btn">${i18n?.apply || 'Apply'}</button>
      `;
      totalsSection.appendChild(couponContainer);

      // Bind coupon apply button
      setTimeout(() => {
        const couponBtn = DOM.qs('.qc-cart-coupon-btn', totalsSection);
        const couponInput = DOM.qs('.qc-cart-coupon-input', totalsSection);
        if (couponBtn && couponInput) {
          DOM.on(couponBtn, 'click', () => this.applyCoupon(couponInput.value));
        }
      }, 0);
    }

    // Subtotal
    const subtotal = DOM.createElement('div', {
      class: 'qc-cart-subtotal'
    });
    subtotal.innerHTML = `
      <span class="qc-cart-subtotal-label">${i18n?.subtotalLabel || 'Subtotal'}</span>
      <span class="qc-cart-subtotal-amount">$0.00</span>
    `;
    totalsSection.appendChild(subtotal);

    // Coupon discount row (hidden by default, shown when coupon applied)
    if (cart.showCouponField) {
      const couponDiscount = DOM.createElement('div', {
        class: 'qc-cart-coupon-discount',
        style: 'display: none;'
      });
      couponDiscount.innerHTML = `
        <span class="qc-cart-coupon-label">Coupon: <strong class="qc-coupon-code"></strong></span>
        <div class="qc-coupon-right">
          <span class="qc-cart-coupon-amount">-$0.00</span>
          <button class="qc-coupon-remove" type="button" aria-label="Remove coupon" title="Remove coupon">×</button>
        </div>
      `;
      totalsSection.appendChild(couponDiscount);
    }

    // Shipping section with methods (if enabled)
    if (cart.showShipping) {
      const shippingSection = DOM.createElement('div', {
        class: 'qc-cart-shipping-section'
      });
      shippingSection.innerHTML = `
        <div class="qc-cart-shipping-row">
          <span class="qc-cart-shipping-label">${i18n?.shipping || 'Shipping'}</span>
          <span class="qc-cart-shipping-amount">$0.00</span>
        </div>
        <div class="qc-cart-shipping-methods">
          <label class="qc-shipping-method">
            <input type="radio" name="shipping_method" value="flat_rate" data-cost="10.00">
            <span class="qc-shipping-method-label">${i18n?.flatRate || 'Flat rate:'}</span>
            <span class="qc-shipping-method-cost">$10.00</span>
          </label>
          <label class="qc-shipping-method">
            <input type="radio" name="shipping_method" value="local_pickup" data-cost="0" checked>
            <span class="qc-shipping-method-label">${i18n?.localPickup || 'Local pickup'}</span>
          </label>
        </div>
        <div class="qc-cart-shipping-destination">
          ${i18n?.shippingTo || 'Shipping to'} <strong>${i18n?.shippingLocation || 'your location'}</strong>
        </div>
      `;
      totalsSection.appendChild(shippingSection);

      // Bind shipping method change
      setTimeout(() => {
        const shippingInputs = totalsSection.querySelectorAll('input[name="shipping_method"]');
        shippingInputs.forEach(input => {
          DOM.on(input, 'change', () => this.updateShipping());
        });
      }, 0);
    }

    // Total
    const totalRow = DOM.createElement('div', {
      class: 'qc-cart-total'
    });
    totalRow.innerHTML = `
      <span class="qc-cart-total-label">${i18n?.total || 'Total'}</span>
      <span class="qc-cart-total-amount">$0.00</span>
    `;
    totalsSection.appendChild(totalRow);

    return totalsSection;
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Close on overlay click
    DOM.on(this.overlay, 'click', () => this.close());

    // Close on ESC key
    DOM.on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Listen for cart toggle event
    DOM.on(document, 'qc:cart:toggle', (e) => {
      const action = e.detail?.action;
      if (action === 'open') {
        this.open();
      } else if (action === 'close') {
        this.close();
      } else {
        this.toggle();
      }
    });
  }

  /**
   * Open panel
   */
  open() {
    if (this.isOpen) return;

    this.isOpen = true;
    DOM.addClass(this.overlay, 'qc-active');
    DOM.addClass(this.panel, 'qc-active');
    document.body.style.overflow = 'hidden';

    // Trigger open event
    DOM.trigger(document, 'qc:cart:opened');
  }

  /**
   * Close panel
   */
  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    DOM.removeClass(this.overlay, 'qc-active');
    DOM.removeClass(this.panel, 'qc-active');
    document.body.style.overflow = '';

    // Trigger close event
    DOM.trigger(document, 'qc:cart:closed');
  }

  /**
   * Toggle panel
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Update cart items
   * @param {Array} items
   * @param {Array} coupons
   */
  updateCartItems(items, coupons = []) {
    // Skip update if we're in the middle of an optimistic update
    if (this.isOptimisticUpdate) {
      return;
    }

    this.cartItems = items;
    const tableWrapper = DOM.qs('.qc-cart-table-wrapper', this.panel);
    const tbody = DOM.qs('.qc-cart-tbody', this.panel);
    const emptyMsg = DOM.qs('.qc-cart-empty', this.panel);
    const totalsSection = DOM.qs('.qc-cart-totals-section', this.panel);
    const footer = DOM.qs('.qc-cart-footer', this.panel);

    if (items.length === 0) {
      emptyMsg.style.display = 'flex';
      tableWrapper.style.display = 'none';
      if (totalsSection) {
        totalsSection.style.display = 'none';
      }
      // Hide footer buttons when cart is empty
      if (footer) {
        footer.style.display = 'none';
      }
    } else {
      emptyMsg.style.display = 'none';
      tableWrapper.style.display = 'block';
      if (totalsSection) {
        totalsSection.style.display = 'block';
      }
      // Show footer buttons when cart has items
      if (footer) {
        footer.style.display = 'block';
      }
      tbody.innerHTML = '';

      items.forEach(item => {
        const itemRow = this.createCartItem(item);
        tbody.appendChild(itemRow);
      });
    }

    // Update coupon display
    this.updateCoupons(coupons);
  }

  /**
   * Update coupon display
   * @param {Array} coupons
   */
  updateCoupons(coupons = []) {
    const discountRow = DOM.qs('.qc-cart-coupon-discount', this.panel);
    if (!discountRow) return;

    if (coupons && coupons.length > 0) {
      const coupon = coupons[0]; // Display first coupon
      const couponCodeEl = DOM.qs('.qc-coupon-code', discountRow);
      const couponAmountEl = DOM.qs('.qc-cart-coupon-amount', discountRow);

      if (couponCodeEl && coupon.code) {
        couponCodeEl.textContent = coupon.code;
      }

      if (couponAmountEl && coupon.discount) {
        couponAmountEl.innerHTML = '-' + coupon.discount;
      }

      // Bind remove button if not already bound
      const removeBtn = DOM.qs('.qc-coupon-remove', discountRow);
      if (removeBtn && coupon.code) {
        // Remove old event listener by cloning
        const newRemoveBtn = removeBtn.cloneNode(true);
        removeBtn.parentNode.replaceChild(newRemoveBtn, removeBtn);

        // Add new event listener
        DOM.on(newRemoveBtn, 'click', (e) => {
          e.preventDefault();
          this.removeCoupon(coupon.code);
        });
      }

      discountRow.style.display = 'flex';
    } else {
      discountRow.style.display = 'none';
    }
  }

  /**
   * Create cart item element (table row)
   * @param {Object} item
   * @returns {HTMLElement}
   */
  createCartItem(item) {
    const { i18n, general } = this.settings;

    // Check if drag and drop is enabled
    const isDragEnabled = general?.enableDragAndDrop;

    const itemRow = DOM.createElement('tr', {
      class: 'qc-cart-item',
      'data-key': item.key,
      ...(isDragEnabled && { draggable: 'true' })
    });

    // Get line subtotal
    const lineSubtotal = item.subtotal || '';

    itemRow.innerHTML = `
      <td class="qc-cart-td qc-cart-td-product">
        <div class="qc-cart-product-cell">
          <div class="qc-cart-item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="qc-cart-item-info">
            <h3 class="qc-cart-item-name">${item.name}</h3>
          </div>
        </div>
      </td>
      <td class="qc-cart-td qc-cart-td-price">
        <span class="qc-cart-item-price">${item.price}</span>
      </td>
      <td class="qc-cart-td qc-cart-td-quantity">
        <div class="qc-cart-item-qty">
          <button class="qc-qty-btn qc-qty-minus" data-key="${item.key}">-</button>
          <input type="number" class="qc-qty-input" value="${item.quantity}" readonly>
          <button class="qc-qty-btn qc-qty-plus" data-key="${item.key}">+</button>
        </div>
      </td>
      <td class="qc-cart-td qc-cart-td-subtotal">
        <span class="qc-cart-item-subtotal">${lineSubtotal}</span>
      </td>
      <td class="qc-cart-td qc-cart-td-remove">
        <button class="qc-cart-item-remove" data-key="${item.key}" aria-label="${i18n?.removeItem || 'Remove item'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </td>
    `;

    // Bind events for this item
    this.bindItemEvents(itemRow, item);

    return itemRow;
  }

  /**
   * Bind events for cart item
   * @param {HTMLElement} itemEl
   * @param {Object} item
   */
  bindItemEvents(itemEl, item) {
    // Quantity minus
    const minusBtn = DOM.qs('.qc-qty-minus', itemEl);
    DOM.on(minusBtn, 'click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Disable button temporarily to prevent double clicks
      if (minusBtn.disabled) return;
      minusBtn.disabled = true;

      const newQty = Math.max(0, item.quantity - 1);
      this.updateItemQuantity(item.key, newQty).finally(() => {
        setTimeout(() => {
          minusBtn.disabled = false;
        }, 300);
      });
    });

    // Quantity plus
    const plusBtn = DOM.qs('.qc-qty-plus', itemEl);
    DOM.on(plusBtn, 'click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Disable button temporarily to prevent double clicks
      if (plusBtn.disabled) return;
      plusBtn.disabled = true;

      this.updateItemQuantity(item.key, item.quantity + 1).finally(() => {
        setTimeout(() => {
          plusBtn.disabled = false;
        }, 300);
      });
    });

    // Remove button
    const removeBtn = DOM.qs('.qc-cart-item-remove', itemEl);
    DOM.on(removeBtn, 'click', () => {
      this.removeItem(item.key);
    });

    // Drag and drop events (if enabled)
    const { general } = this.settings;
    if (general?.enableDragAndDrop) {
      this.bindDragEvents(itemEl);
    }
  }

  /**
   * Bind drag and drop events to cart item
   * @param {HTMLElement} itemEl
   */
  bindDragEvents(itemEl) {
    // Dragstart - when user starts dragging
    DOM.on(itemEl, 'dragstart', (e) => {
      this.draggedItem = itemEl;
      DOM.addClass(itemEl, 'qc-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', itemEl.innerHTML);
    });

    // Dragend - when drag operation ends
    DOM.on(itemEl, 'dragend', (e) => {
      DOM.removeClass(itemEl, 'qc-dragging');
      this.draggedItem = null;

      // Remove all drag-over classes
      const allItems = this.panel.querySelectorAll('.qc-cart-item');
      allItems.forEach(item => {
        DOM.removeClass(item, 'qc-drag-over');
      });
    });

    // Dragover - when dragging over another item
    DOM.on(itemEl, 'dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      if (this.draggedItem && this.draggedItem !== itemEl) {
        DOM.addClass(itemEl, 'qc-drag-over');
      }
    });

    // Dragleave - when leaving a droppable area
    DOM.on(itemEl, 'dragleave', (e) => {
      DOM.removeClass(itemEl, 'qc-drag-over');
    });

    // Drop - when dropping the item
    DOM.on(itemEl, 'drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      DOM.removeClass(itemEl, 'qc-drag-over');

      if (this.draggedItem && this.draggedItem !== itemEl) {
        // Get the tbody container
        const tbody = itemEl.parentNode;

        // Get all items
        const allItems = Array.from(tbody.querySelectorAll('.qc-cart-item'));
        const draggedIndex = allItems.indexOf(this.draggedItem);
        const targetIndex = allItems.indexOf(itemEl);

        // Reorder in DOM
        if (draggedIndex < targetIndex) {
          // Moving down: insert after target
          tbody.insertBefore(this.draggedItem, itemEl.nextSibling);
        } else {
          // Moving up: insert before target
          tbody.insertBefore(this.draggedItem, itemEl);
        }

        // Update the cartItems array to match the new order
        this.reorderCartItems();

        // Trigger custom event for reorder
        DOM.trigger(document, 'qc:cart:reordered', {
          draggedKey: this.draggedItem.getAttribute('data-key'),
          targetKey: itemEl.getAttribute('data-key')
        });
      }
    });
  }

  /**
   * Reorder cartItems array to match DOM order
   */
  reorderCartItems() {
    const tbody = DOM.qs('.qc-cart-tbody', this.panel);
    if (!tbody) return;

    const orderedKeys = Array.from(tbody.querySelectorAll('.qc-cart-item'))
      .map(row => row.getAttribute('data-key'));

    // Reorder cartItems array to match DOM order
    this.cartItems.sort((a, b) => {
      const indexA = orderedKeys.indexOf(a.key);
      const indexB = orderedKeys.indexOf(b.key);
      return indexA - indexB;
    });
  }

  /**
   * Update item quantity
   * @param {string} cartItemKey
   * @param {number} quantity
   * @returns {Promise}
   */
  updateItemQuantity(cartItemKey, quantity) {
    const settings = window.qcShoppingData || {};
    const ajaxUrl = settings.meta?.ajaxUrl;
    const nonce = settings.meta?.nonce;

    if (!ajaxUrl || !nonce) {
      return Promise.resolve();
    }

    // Find the item in cart
    const item = this.cartItems.find(i => i.key === cartItemKey);
    if (!item) {
      return Promise.resolve();
    }

    // Store previous quantity for rollback
    const previousQuantity = item.quantity;
    const previousSubtotal = item.subtotal;

    // OPTIMISTIC UPDATE: Update UI immediately
    item.quantity = quantity;

    // Find the item row in DOM
    const itemRow = this.panel.querySelector(`[data-key="${cartItemKey}"]`);
    if (itemRow) {
      // Update quantity input
      const qtyInput = DOM.qs('.qc-qty-input', itemRow);
      if (qtyInput) {
        qtyInput.value = quantity;
      }

      // Calculate and update item subtotal
      const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      const newSubtotal = itemPrice * quantity;
      item.subtotal = `$${newSubtotal.toFixed(2)}`;

      const subtotalEl = DOM.qs('.qc-cart-item-subtotal', itemRow);
      if (subtotalEl) {
        subtotalEl.textContent = item.subtotal;
      }
    }

    // Update totals immediately
    this.updateTotals();

    // Calculate total cart count (sum of all quantities) and update badge immediately
    const totalCartCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);

    // Get reference to main QuickCartShopping instance
    const mainInstance = window.qcShoppingInstance;
    if (mainInstance && mainInstance.cartToggle) {
      mainInstance.cartToggle.updateCartCount(totalCartCount);
    }

    // Set flag to prevent cart refresh from overwriting optimistic updates
    this.isOptimisticUpdate = true;

    // THEN perform AJAX call in background
    return fetch(ajaxUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'qcshopping_update_cart_item',
        nonce: nonce,
        cart_item_key: cartItemKey,
        quantity: quantity
      })
    })
    .then(response => response.json())
    .then(result => {
      // Clear optimistic update flag after a short delay
      setTimeout(() => {
        this.isOptimisticUpdate = false;
      }, 100);

      if (result.success) {
        // Update badge with server response if available
        if (result.data && result.data.cart_count !== undefined && mainInstance && mainInstance.cartToggle) {
          mainInstance.cartToggle.updateCartCount(result.data.cart_count);
        }
      } else {
        // AJAX failed - rollback to previous quantity
        console.warn('Failed to update quantity on server, rolling back');
        item.quantity = previousQuantity;
        item.subtotal = previousSubtotal;

        if (itemRow) {
          const qtyInput = DOM.qs('.qc-qty-input', itemRow);
          if (qtyInput) {
            qtyInput.value = previousQuantity;
          }
          const subtotalEl = DOM.qs('.qc-cart-item-subtotal', itemRow);
          if (subtotalEl) {
            subtotalEl.textContent = previousSubtotal;
          }
        }

        this.updateTotals();

        // Rollback badge count
        const rollbackCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
        const mainInstance = window.qcShoppingInstance;
        if (mainInstance && mainInstance.cartToggle) {
          mainInstance.cartToggle.updateCartCount(rollbackCount);
        }
      }
    })
    .catch(error => {
      // Network error - rollback to previous quantity
      console.warn('Failed to update quantity:', error);
      this.isOptimisticUpdate = false;
      item.quantity = previousQuantity;
      item.subtotal = previousSubtotal;

      if (itemRow) {
        const qtyInput = DOM.qs('.qc-qty-input', itemRow);
        if (qtyInput) {
          qtyInput.value = previousQuantity;
        }
        const subtotalEl = DOM.qs('.qc-cart-item-subtotal', itemRow);
        if (subtotalEl) {
          subtotalEl.textContent = previousSubtotal;
        }
      }

      this.updateTotals();

      // Rollback badge count
      const rollbackCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
      const mainInstance = window.qcShoppingInstance;
      if (mainInstance && mainInstance.cartToggle) {
        mainInstance.cartToggle.updateCartCount(rollbackCount);
      }
    });
  }

  /**
   * Remove item from cart
   * @param {string} cartItemKey
   */
  removeItem(cartItemKey) {
    const settings = window.qcShoppingData || {};
    const ajaxUrl = settings.meta?.ajaxUrl;
    const nonce = settings.meta?.nonce;

    if (!ajaxUrl || !nonce) {
      return;
    }

    fetch(ajaxUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'qcshopping_remove_cart_item',
        nonce: nonce,
        cart_item_key: cartItemKey
      })
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        // Trigger cart refresh
        DOM.trigger(document, 'qc:cart:updated', result.data);
        // Reload cart items
        DOM.trigger(document.body, 'wc_fragments_refreshed');
      }
    })
    .catch(error => {
      console.warn('Failed to remove item:', error);
    });
  }

  /**
   * Update totals - Use WooCommerce cart totals
   * @param {Object|string} totals - Can be object with WC totals or string (legacy)
   */
  updateTotals(totals) {
    // Handle both legacy string format and new object format
    if (typeof totals === 'string') {
      // Legacy: just subtotal string
      const subtotalAmount = DOM.qs('.qc-cart-subtotal-amount', this.panel);
      if (subtotalAmount) {
        subtotalAmount.innerHTML = totals;
      }
      this.updateShipping();
      return;
    }

    if (typeof totals === 'object' && totals !== null) {
      // New format: WooCommerce totals object
      const { subtotal, discount_total, shipping_total, total_tax, total } = totals;

      // Update subtotal
      const subtotalEl = DOM.qs('.qc-cart-subtotal-amount', this.panel);
      if (subtotalEl && subtotal) {
        subtotalEl.innerHTML = subtotal;
      }

      // Update discount (if exists)
      if (discount_total > 0) {
        const discountEl = DOM.qs('.qc-cart-discount-amount', this.panel);
        if (discountEl) {
          discountEl.textContent = `-$${parseFloat(discount_total).toFixed(2)}`;
        }
      }

      // Update shipping amount from server (this is the actual shipping cost)
      if (shipping_total !== undefined) {
        const shippingEl = DOM.qs('.qc-cart-shipping-amount', this.panel);
        if (shippingEl) {
          const shippingValue = parseFloat(shipping_total);
          if (shippingValue > 0) {
            shippingEl.textContent = `$${shippingValue.toFixed(2)}`;
          } else {
            shippingEl.textContent = 'Free';
          }
        }
      }

      // Update tax (if exists)
      if (total_tax !== undefined && parseFloat(total_tax) > 0) {
        const taxEl = DOM.qs('.qc-cart-tax-amount', this.panel);
        if (taxEl) {
          taxEl.textContent = `$${parseFloat(total_tax).toFixed(2)}`;
        }
      }

      // Update total from server - this is the correct total including all calculations
      const totalEl = DOM.qs('.qc-cart-total-amount', this.panel);
      if (totalEl && total) {
        totalEl.innerHTML = total;
      }

      return;
    }

    // Fallback: Calculate from cart items
    let calculatedSubtotal = 0;
    if (this.cartItems && this.cartItems.length > 0) {
      this.cartItems.forEach(item => {
        const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
        const itemQty = item.quantity || 0;
        calculatedSubtotal += itemPrice * itemQty;
      });
    }

    const subtotalAmount = DOM.qs('.qc-cart-subtotal-amount', this.panel);
    if (subtotalAmount) {
      subtotalAmount.textContent = `$${calculatedSubtotal.toFixed(2)}`;
    }

    this.updateShipping();
  }

  /**
   * Apply coupon code
   * @param {string} couponCode
   */
  async applyCoupon(couponCode) {
    if (!couponCode || !couponCode.trim()) {
      return;
    }

    const settings = window.qcShoppingData || {};
    const ajaxUrl = settings.meta?.ajaxUrl;
    const nonce = settings.meta?.nonce;

    if (!ajaxUrl || !nonce) {
      return;
    }

    const couponBtn = DOM.qs('.qc-cart-coupon-btn', this.panel);
    const couponInput = DOM.qs('.qc-cart-coupon-input', this.panel);

    if (couponBtn) {
      couponBtn.disabled = true;
      couponBtn.textContent = 'Applying...';
    }

    try {
      const response = await fetch(ajaxUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'qcshopping_apply_coupon',
          nonce: nonce,
          coupon_code: couponCode.trim()
        })
      });

      const result = await response.json();

      if (result.success) {
        // Clear input
        if (couponInput) {
          couponInput.value = '';
        }

        // Trigger WooCommerce cart refresh to reload cart items with coupons
        DOM.trigger(document.body, 'wc_fragments_refreshed');
      } else {
        alert(result.data?.message || 'Failed to apply coupon');
      }
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      alert('Failed to apply coupon. Please try again.');
    } finally {
      if (couponBtn) {
        couponBtn.disabled = false;
        couponBtn.textContent = this.settings.i18n?.apply || 'Apply';
      }
    }
  }

  /**
   * Remove coupon code
   * @param {string} couponCode
   */
  async removeCoupon(couponCode) {
    if (!couponCode || !couponCode.trim()) {
      return;
    }

    const settings = window.qcShoppingData || {};
    const ajaxUrl = settings.meta?.ajaxUrl;
    const nonce = settings.meta?.nonce;

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
          action: 'qcshopping_remove_coupon',
          nonce: nonce,
          coupon_code: couponCode.trim()
        })
      });

      const result = await response.json();

      if (result.success) {
        // Trigger WooCommerce cart refresh to reload cart items without coupon
        DOM.trigger(document.body, 'wc_fragments_refreshed');
      } else {
        alert(result.data?.message || 'Failed to remove coupon');
      }
    } catch (error) {
      console.error('Failed to remove coupon:', error);
      alert('Failed to remove coupon. Please try again.');
    }
  }

  /**
   * Update shipping methods dynamically from WooCommerce
   * @param {Array} shippingMethods - Array of shipping method objects from WooCommerce
   * @param {string} shippingDestination - Shipping destination address
   */
  updateShippingMethods(shippingMethods = [], shippingDestination = '') {
    const shippingSection = DOM.qs('.qc-cart-shipping-section', this.panel);
    if (!shippingSection) return;

    const shippingMethodsContainer = DOM.qs('.qc-cart-shipping-methods', shippingSection);
    const shippingDestinationEl = DOM.qs('.qc-cart-shipping-destination', shippingSection);

    // Update shipping methods if we have them
    if (shippingMethods && shippingMethods.length > 0) {
      shippingMethodsContainer.innerHTML = '';

      shippingMethods.forEach(method => {
        const methodLabel = DOM.createElement('label', {
          class: 'qc-shipping-method'
        });

        const isChecked = method.selected ? 'checked' : '';
        const costDisplay = parseFloat(method.cost) > 0
          ? `<span class="qc-shipping-method-cost">${method.cost_formatted}</span>`
          : '';

        methodLabel.innerHTML = `
          <input type="radio" name="shipping_method" value="${method.id}" data-cost="${method.cost}" ${isChecked}>
          <span class="qc-shipping-method-label">${method.label}${costDisplay ? ':' : ''}</span>
          ${costDisplay}
        `;

        shippingMethodsContainer.appendChild(methodLabel);
      });

      // Bind change event to all shipping method radio buttons
      const shippingInputs = shippingMethodsContainer.querySelectorAll('input[name="shipping_method"]');
      shippingInputs.forEach(input => {
        DOM.on(input, 'change', () => this.handleShippingMethodChange(input.value));
      });
    }

    // Update shipping destination if available
    if (shippingDestination && shippingDestinationEl) {
      const { i18n } = this.settings;
      shippingDestinationEl.innerHTML = `
        ${i18n?.shippingTo || 'Shipping to'} <strong>${shippingDestination}</strong>
      `;
    }
  }

  /**
   * Handle shipping method change via AJAX
   * @param {string} shippingMethodId - The selected shipping method ID
   */
  async handleShippingMethodChange(shippingMethodId) {
    const settings = window.qcShoppingData || {};
    const ajaxUrl = settings.meta?.ajaxUrl;
    const nonce = settings.meta?.nonce;

    if (!ajaxUrl || !nonce || !shippingMethodId) {
      return;
    }

    try {
      const response = await fetch(ajaxUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'qcshopping_update_shipping_method',
          nonce: nonce,
          shipping_method: shippingMethodId
        })
      });

      const result = await response.json();

      if (result.success) {
        // Refresh cart totals to reflect new shipping cost
        DOM.trigger(document.body, 'wc_fragments_refreshed');
      } else {
        console.warn('Failed to update shipping method:', result.data?.message);
      }
    } catch (error) {
      console.error('Failed to update shipping method:', error);
    }
  }

  /**
   * Update shipping cost based on selected method
   */
  updateShipping() {
    const selectedShipping = DOM.qs('input[name="shipping_method"]:checked', this.panel);
    const shippingAmountEl = DOM.qs('.qc-cart-shipping-amount', this.panel);
    const subtotalAmountEl = DOM.qs('.qc-cart-subtotal-amount', this.panel);
    const totalAmountEl = DOM.qs('.qc-cart-total-amount', this.panel);

    if (!selectedShipping || !shippingAmountEl || !subtotalAmountEl || !totalAmountEl) {
      return;
    }

    // Get shipping cost from data attribute
    const shippingCost = parseFloat(selectedShipping.getAttribute('data-cost')) || 0;

    // Get subtotal value (parse from text, removing currency symbols)
    const subtotalText = subtotalAmountEl.textContent.trim();
    const subtotalValue = parseFloat(subtotalText.replace(/[^0-9.]/g, '')) || 0;

    // Calculate total
    const totalValue = subtotalValue + shippingCost;

    // Format shipping amount
    if (shippingCost > 0) {
      shippingAmountEl.textContent = `$${shippingCost.toFixed(2)}`;
    } else {
      shippingAmountEl.textContent = 'Free';
    }

    // Update total
    totalAmountEl.textContent = `$${totalValue.toFixed(2)}`;
  }

  /**
   * Bind checkout button click handler
   */
  bindCheckoutButton() {
    const checkoutBtn = DOM.qs('.qc-cart-checkout-btn', this.panel);
    if (!checkoutBtn) return;

    DOM.on(checkoutBtn, 'click', () => {
      const { general, meta } = this.settings;

      // If Pro checkout is available and direct checkout is enabled, show it
      if (general?.enableDirectCheckout && this.multiStepCheckout) {
        this.multiStepCheckout.show();
      } else {
        // Otherwise, redirect to WooCommerce checkout page
        window.location.href = meta?.checkoutUrl || '/checkout';
      }
    });
  }

  /**
   * Destroy panel
   */
  destroy() {
    if (this.panel) {
      DOM.remove(this.panel);
      this.panel = null;
    }
    if (this.overlay) {
      DOM.remove(this.overlay);
      this.overlay = null;
    }
  }
}
