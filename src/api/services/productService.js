/**
 * Product Service Module
 *
 * Handles API requests for products.
 *
 * @module api/services/productService
 * @since 1.0.0
 * @package Quick Cart Shopping
 */

import apiClient from '@/api/apiClient';

/**
 * Product Service
 */
export const productService = {
  /**
   * Get all products
   * @param {Object} params - Query parameters
   * @param {number} [params.per_page=100] - Products per page
   * @param {number} [params.page=1] - Current page
   * @param {string} [params.search] - Search keyword
   * @returns {Promise<Array>} Products array
   */
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        per_page: params.per_page || 100,
        page: params.page || 1,
        ...(params.search && { search: params.search })
      });

      return await apiClient.get(`/products?${queryParams.toString()}`);
    } catch (error) {
      console.error('[productService] Get products error:', error);
      throw new Error(`Failed to get products: ${error.message}`);
    }
  },

  /**
   * Get single product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Product data
   */
  async getProduct(id) {
    try {
      return await apiClient.get(`/products/${id}`);
    } catch (error) {
      console.error('[productService] Get product error:', error);
      throw new Error(`Failed to get product: ${error.message}`);
    }
  }
};

export default productService;
