/**
 * Settings Service Module
 *
 * Handles API requests for advanced settings (upsell products, etc.).
 *
 * @module api/services/settingsService
 * @since 1.0.0
 * @package Quick Cart Shopping
 */

import apiClient from '@/api/apiClient';

/**
 * Settings Service
 */
export const settingsService = {
  /**
   * Get settings
   * @returns {Promise<Object>} Settings data
   */
  async get() {
    try {
      return await apiClient.get('/settings');
    } catch (error) {
      console.error('[settingsService] Get settings error:', error);
      throw new Error(`Failed to get settings: ${error.message}`);
    }
  },

  /**
   * Save settings
   * @param {Object} data - Settings data
   * @returns {Promise<Object>} Response data
   */
  async save(data) {
    try {
      return await apiClient.post('/settings', data);
    } catch (error) {
      console.error('[settingsService] Save settings error:', error);
      throw new Error(`Failed to save settings: ${error.message}`);
    }
  }
};

export default settingsService;
