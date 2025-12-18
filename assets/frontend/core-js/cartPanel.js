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

    return body;
  }

  /**
   * Create panel footer
   * @returns {HTMLElement}
   */
  createFooter() {
    const { cart, i18n } = this.settings;
    const footer = DOM.createElement('div', {
      class: 'qc-cart-footer'
    });

    // Subtotal
    const subtotal = DOM.createElement('div', {
      class: 'qc-cart-subtotal'
    });
    subtotal.innerHTML = `
      <span class="qc-cart-subtotal-label">${i18n?.subtotalLabel || 'Subtotal:'}</span>
      <span class="qc-cart-subtotal-amount">$0.00</span>
    `;
    footer.appendChild(subtotal);

    // Shipping info (if enabled)
    if (cart.showShipping) {
      const shipping = DOM.createElement('div', {
        class: 'qc-cart-shipping'
      });
      shipping.innerHTML = `
        <span class="qc-cart-shipping-label">${i18n?.shipping || 'Shipping:'}</span>
        <span class="qc-cart-shipping-amount">${i18n?.calculatedAtCheckout || 'Calculated at checkout'}</span>
      `;
      footer.appendChild(shipping);
    }

    // Coupon field (if enabled)
    if (cart.showCouponField) {
      const couponContainer = DOM.createElement('div', {
        class: 'qc-cart-coupon'
      });
      couponContainer.innerHTML = `
        <input type="text" class="qc-cart-coupon-input" placeholder="${i18n?.couponCode || 'Coupon code'}">
        <button type="button" class="qc-cart-coupon-btn">${i18n?.apply || 'Apply'}</button>
      `;
      footer.appendChild(couponContainer);
    }

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

      footer.appendChild(checkoutBtn);
    }

    // View cart link
    const viewCartLink = DOM.createElement('a', {
      class: 'qc-cart-view-link',
      href: '/cart'
    }, i18n?.viewCart || 'View Cart');
    footer.appendChild(viewCartLink);

    return footer;
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
   */
  updateCartItems(items) {
    this.cartItems = items;
    const tableWrapper = DOM.qs('.qc-cart-table-wrapper', this.panel);
    const tbody = DOM.qs('.qc-cart-tbody', this.panel);
    const emptyMsg = DOM.qs('.qc-cart-empty', this.panel);

    if (items.length === 0) {
      emptyMsg.style.display = 'flex';
      tableWrapper.style.display = 'none';
    } else {
      emptyMsg.style.display = 'none';
      tableWrapper.style.display = 'block';
      tbody.innerHTML = '';

      items.forEach(item => {
        const itemRow = this.createCartItem(item);
        tbody.appendChild(itemRow);
      });
    }
  }

  /**
   * Create cart item element (table row)
   * @param {Object} item
   * @returns {HTMLElement}
   */
  createCartItem(item) {
    const { i18n } = this.settings;
    const itemRow = DOM.createElement('tr', {
      class: 'qc-cart-item',
      'data-key': item.key
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
    DOM.on(minusBtn, 'click', () => {
      const newQty = Math.max(0, item.quantity - 1);
      this.updateItemQuantity(item.key, newQty);
    });

    // Quantity plus
    const plusBtn = DOM.qs('.qc-qty-plus', itemEl);
    DOM.on(plusBtn, 'click', () => {
      this.updateItemQuantity(item.key, item.quantity + 1);
    });

    // Remove button
    const removeBtn = DOM.qs('.qc-cart-item-remove', itemEl);
    DOM.on(removeBtn, 'click', () => {
      this.removeItem(item.key);
    });
  }

  /**
   * Update item quantity
   * @param {string} cartItemKey
   * @param {number} quantity
   */
  updateItemQuantity(cartItemKey, quantity) {
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
        action: 'qc_update_cart_item',
        nonce: nonce,
        cart_item_key: cartItemKey,
        quantity: quantity
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
      console.warn('Failed to update quantity:', error);
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
        action: 'qc_remove_cart_item',
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
   * Update totals
   * @param {string} subtotal
   */
  updateTotals(subtotal) {
    const subtotalAmount = DOM.qs('.qc-cart-subtotal-amount', this.panel);
    if (subtotalAmount) {
      subtotalAmount.innerHTML = subtotal;
    }
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
