/**
 * Cart Toggle Component
 *
 * @package Quick Cart Shopping
 * @since 1.0.0
 */

import { DOM } from '../utils/dom.js';

export class CartToggle {
  constructor(settings) {
    this.settings = settings;
    this.container = null;
    this.toggle = null;
    this.badge = null;
    this.cartCount = 0;

    this.init();
  }

  /**
   * Initialize cart toggle
   */
  init() {
    this.container = DOM.qs('#qc-cart-toggle-container');
    if (!this.container) {
      console.warn('Cart toggle container not found');
      return;
    }

    this.render();
    this.bindEvents();
    // Set default count to 0 (static for now)
    this.updateCartCount(0);
  }

  /**
   * Render toggle button
   */
  render() {
    const { toggle } = this.settings;

    // Create toggle button
    this.toggle = DOM.createElement('button', {
      class: this.getToggleClasses(),
      'aria-label': 'Open shopping cart',
      'aria-expanded': 'false',
      role: 'button',
      tabindex: '0'
    });

    // Button should be larger than icon to have padding (add 30px for padding)
    const buttonSize = toggle.iconSize + 30;

    // Apply dynamic styles
    DOM.setStyles(this.toggle, {
      width: `${buttonSize}px`,
      height: `${buttonSize}px`,
      backgroundColor: toggle.iconBgColor,
      color: toggle.iconColor
    });

    // Create icon container
    const iconContainer = DOM.createElement('span', {
      class: 'qc-cart-toggle__icon'
    });

    // Set icon size directly from settings (exact size, not percentage)
    DOM.setStyles(iconContainer, {
      width: `${toggle.iconSize}px`,
      height: `${toggle.iconSize}px`
    });

    // Load and insert SVG icon
    this.loadIconSVG(toggle.iconStyle, iconContainer, toggle.iconColor);

    this.toggle.appendChild(iconContainer);

    // Create badge if enabled
    if (toggle.showBadge) {
      this.badge = DOM.createElement('span', {
        class: 'qc-cart-toggle__badge'
      }, '0');

      DOM.setStyles(this.badge, {
        backgroundColor: toggle.badgeBgColor,
        color: toggle.badgeTextColor
      });

      this.toggle.appendChild(this.badge);
    }

    // Append to container
    this.container.appendChild(this.toggle);

    // Show container
    this.container.style.display = 'block';
  }

  /**
   * Get toggle button classes
   * @returns {string}
   */
  getToggleClasses() {
    const { toggle } = this.settings;
    const classes = ['qc-cart-toggle'];

    // Position class
    classes.push(`qc-position-${toggle.iconPosition}`);

    // Shape class
    classes.push(`qc-shape-${toggle.borderShape}`);

    return classes.join(' ');
  }

  /**
   * Load and insert SVG icon with dynamic color
   * @param {string} style - Icon style (cart, bag, basket)
   * @param {HTMLElement} container - Container element
   * @param {string} color - Icon color
   */
  async loadIconSVG(style, container, color) {
    const pluginUrl = this.settings.meta?.pluginUrl || '';

    // Map icon styles to SVG filenames
    const iconMap = {
      cart: 'shopping-cart.svg',
      'cart-solid': 'shopping-cart-solid.svg',
      bag: 'shopping-bag.svg',
      'bag-solid': 'shopping-bag-solid.svg',
      basket: 'shopping-bag.svg' // Fallback
    };

    const iconFile = iconMap[style] || iconMap.cart;
    const iconUrl = `${pluginUrl}assets/icons/${iconFile}`;

    try {
      // Fetch SVG content
      const response = await fetch(iconUrl);
      const svgText = await response.text();

      // Create a temporary container to parse SVG
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = svgText;

      const svgElement = tempDiv.querySelector('svg');

      if (svgElement) {
        // Check if it's an outline (stroke-based) or solid (fill-based) icon
        const isOutline = svgElement.getAttribute('fill') === 'none' ||
                          svgElement.hasAttribute('stroke');

        if (isOutline) {
          // For outline icons: apply stroke color
          svgElement.setAttribute('stroke', color);
          svgElement.style.stroke = color;

          // Apply stroke to all paths
          const paths = svgElement.querySelectorAll('path, circle, rect, line, polyline, polygon');
          paths.forEach(path => {
            path.setAttribute('stroke', color);
            // Keep fill="none" for outline icons
            if (!path.hasAttribute('fill') || path.getAttribute('fill') !== 'none') {
              path.setAttribute('fill', 'none');
            }
          });
        } else {
          // For solid icons: apply fill color
          svgElement.setAttribute('fill', color);
          svgElement.style.fill = color;

          // Apply fill to all paths
          const paths = svgElement.querySelectorAll('path, circle, rect, line, polyline, polygon');
          paths.forEach(path => {
            if (path.getAttribute('fill') !== 'none') {
              path.setAttribute('fill', color);
            }
          });
        }

        container.innerHTML = '';
        container.appendChild(svgElement);
      }
    } catch (error) {
      console.error('Failed to load icon SVG:', error);
      // Fallback: Show text
      container.innerHTML = '<span>🛒</span>';
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    if (!this.toggle) return;

    // Click event
    DOM.on(this.toggle, 'click', () => this.handleClick());

    // Listen for cart update events
    DOM.on(document, 'qc:cart:updated', (e) => this.updateCartCount(e.detail.count));
  }

  /**
   * Handle toggle click
   */
  handleClick() {
    // Trigger cart open event
    DOM.trigger(document, 'qc:cart:toggle', { action: 'open' });

    // Toggle aria-expanded
    const isExpanded = this.toggle.getAttribute('aria-expanded') === 'true';
    this.toggle.setAttribute('aria-expanded', !isExpanded);

    // Add pulse animation
    DOM.addClass(this.toggle, 'qc-pulse');
    setTimeout(() => {
      DOM.removeClass(this.toggle, 'qc-pulse');
    }, 500);
  }

  /**
   * Update cart count
   * @param {number} count
   */
  updateCartCount(count = 0) {
    this.cartCount = count;

    if (this.badge && this.settings.toggle.showBadge) {
      this.badge.textContent = count > 99 ? '99+' : count.toString();

      // Always show badge if showBadge is enabled
      this.badge.style.display = 'flex';
    }
  }

  /**
   * Show toggle
   */
  show() {
    if (this.toggle) {
      DOM.removeClass(this.toggle, 'qc-hidden');
    }
  }

  /**
   * Hide toggle
   */
  hide() {
    if (this.toggle) {
      DOM.addClass(this.toggle, 'qc-hidden');
    }
  }

  /**
   * Destroy toggle
   */
  destroy() {
    if (this.toggle) {
      DOM.remove(this.toggle);
      this.toggle = null;
      this.badge = null;
    }
  }
}
