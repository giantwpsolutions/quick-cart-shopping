/**
 * API Client Module
 *
 * Provides a wrapper around WordPress apiFetch for making REST API requests
 * to the Quick Cart Shopping endpoints.
 *
 * @module api/apiClient
 * @since 1.0.0
 * @package Quick Cart Shopping
 */

const apiFetch = window.wp?.apiFetch;

/**
 * Base path for all Quick Cart Shopping API endpoints
 * @constant {string}
 */
const API_BASE = '/quick-cart-shopping/v2';

/**
 * API Client object providing HTTP methods
 *
 * @namespace apiClient
 * @property {Function} get - Make GET request
 * @property {Function} post - Make POST request
 * @property {Function} put - Make PUT request
 * @property {Function} delete - Make DELETE request
 */
const apiClient = {
  /**
   * Makes a GET request to the API
   *
   * @param {string} path - API endpoint path (e.g., '/pages')
   * @param {Object} [options={}] - Additional fetch options
   * @returns {Promise<*>} Response data
   *
   * @example
   * const pages = await apiClient.get('/pages')
   */
  get: (path, options = {}) =>
    apiFetch({ path: `${API_BASE}${path}`, method: 'GET', ...options }),

  /**
   * Makes a POST request to the API
   *
   * @param {string} path - API endpoint path
   * @param {Object} [data={}] - Request body data
   * @param {Object} [options={}] - Additional fetch options
   * @returns {Promise<*>} Response data
   *
   * @example
   * const result = await apiClient.post('/settings', { key: 'value' })
   */
  post: (path, data = {}, options = {}) =>
    apiFetch({ path: `${API_BASE}${path}`, method: 'POST', data, ...options }),

  /**
   * Makes a PUT request to the API
   *
   * @param {string} path - API endpoint path
   * @param {Object} [data={}] - Request body data
   * @param {Object} [options={}] - Additional fetch options
   * @returns {Promise<*>} Response data
   *
   * @example
   * const updated = await apiClient.put('/settings/42', { key: 'newValue' })
   */
  put: (path, data = {}, options = {}) =>
    apiFetch({ path: `${API_BASE}${path}`, method: 'PUT', data, ...options }),

  /**
   * Makes a DELETE request to the API
   *
   * @param {string} path - API endpoint path
   * @param {Object} [options={}] - Additional fetch options
   * @returns {Promise<*>} Response data
   *
   * @example
   * await apiClient.delete('/settings/42')
   */
  delete: (path, options = {}) =>
    apiFetch({ path: `${API_BASE}${path}`, method: 'DELETE', ...options }),
};

export default apiClient;
