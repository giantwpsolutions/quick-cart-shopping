/**
 * DOM Utility Functions
 *
 * @package Quick Cart Shopping
 * @since 1.0.0
 */

export const DOM = {
  /**
   * Create element with attributes
   * @param {string} tag - HTML tag name
   * @param {Object} attrs - Element attributes
   * @param {string|HTMLElement} content - Element content
   * @returns {HTMLElement}
   */
  createElement(tag, attrs = {}, content = null) {
    const element = document.createElement(tag);

    // Set attributes
    Object.keys(attrs).forEach(key => {
      if (key === 'class') {
        element.className = attrs[key];
      } else if (key === 'style' && typeof attrs[key] === 'object') {
        Object.assign(element.style, attrs[key]);
      } else if (key.startsWith('data-')) {
        element.setAttribute(key, attrs[key]);
      } else {
        element[key] = attrs[key];
      }
    });

    // Set content
    if (content !== null) {
      if (typeof content === 'string') {
        element.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        element.appendChild(content);
      }
    }

    return element;
  },

  /**
   * Add multiple classes to element
   * @param {HTMLElement} element
   * @param {...string} classes
   */
  addClass(element, ...classes) {
    element.classList.add(...classes);
  },

  /**
   * Remove multiple classes from element
   * @param {HTMLElement} element
   * @param {...string} classes
   */
  removeClass(element, ...classes) {
    element.classList.remove(...classes);
  },

  /**
   * Toggle class on element
   * @param {HTMLElement} element
   * @param {string} className
   * @param {boolean} force
   */
  toggleClass(element, className, force = undefined) {
    return element.classList.toggle(className, force);
  },

  /**
   * Check if element has class
   * @param {HTMLElement} element
   * @param {string} className
   * @returns {boolean}
   */
  hasClass(element, className) {
    return element.classList.contains(className);
  },

  /**
   * Set multiple styles on element
   * @param {HTMLElement} element
   * @param {Object} styles
   */
  setStyles(element, styles) {
    Object.assign(element.style, styles);
  },

  /**
   * Query selector
   * @param {string} selector
   * @param {HTMLElement} parent
   * @returns {HTMLElement|null}
   */
  qs(selector, parent = document) {
    return parent.querySelector(selector);
  },

  /**
   * Query selector all
   * @param {string} selector
   * @param {HTMLElement} parent
   * @returns {NodeList}
   */
  qsa(selector, parent = document) {
    return parent.querySelectorAll(selector);
  },

  /**
   * Add event listener
   * @param {HTMLElement} element
   * @param {string} event
   * @param {Function} handler
   * @param {Object} options
   */
  on(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
  },

  /**
   * Remove event listener
   * @param {HTMLElement} element
   * @param {string} event
   * @param {Function} handler
   */
  off(element, event, handler) {
    element.removeEventListener(event, handler);
  },

  /**
   * Trigger custom event
   * @param {HTMLElement} element
   * @param {string} eventName
   * @param {Object} detail
   */
  trigger(element, eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      detail
    });
    element.dispatchEvent(event);
  },

  /**
   * Wait for DOM ready
   * @param {Function} callback
   */
  ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  },

  /**
   * Remove element from DOM
   * @param {HTMLElement} element
   */
  remove(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  },

  /**
   * Get element's offset from viewport
   * @param {HTMLElement} element
   * @returns {Object}
   */
  getOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    };
  }
};
