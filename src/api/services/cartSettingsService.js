/**
 * Cart Settings Service Module
 *
 * Handles API requests for cart plugin settings.
 *
 * @module api/services/cartSettingsService
 * @since 1.0.0
 * @package Quick Cart Shopping
 */

import apiClient from '@/api/apiClient';

/**
 * Generate unique ID for settings
 * @returns {string} Unique ID
 */
const generateUniqueId = () =>
  `settings-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;

/**
 * Validate status value
 * @param {string} status - Status value
 * @returns {string} Valid status (on/off)
 */
const validateStatus = (status) =>
  ['on', 'off'].includes(status) ? status : 'on';

/**
 * Cart Settings Service
 */
export const cartSettingsService = {
  /**
   * Save cart settings
   * @param {Object} settingsData - Settings data
   * @returns {Promise<Object>} Response
   */
  async save(settingsData) {
    try {
      const payload = {
        id: generateUniqueId(),
        createdAt: new Date().toISOString(),
        status: validateStatus(settingsData.status || 'on'),
        showShipping: settingsData.showShipping ?? true,
        showCouponField: settingsData.showCouponField ?? true,
        checkoutBtnBgColor: settingsData.checkoutBtnBgColor ?? '#05291B',
        checkoutBtnTextColor: settingsData.checkoutBtnTextColor ?? '#ffffff',
        showCheckoutBtn: settingsData.showCheckoutBtn ?? true,
      };

      const response = await apiClient.post('/save-cart-settings', payload);
      return response;
    } catch (error) {
      console.error('[cartSettingsService] Save error:', error);
      throw new Error(`Failed to save settings: ${error.message}`);
    }
  },

  /**
   * Get all cart settings
   * @returns {Promise<Object>} Settings data
   */
  async get() {
    try {
      return await apiClient.get('/get-cart-settings');
    } catch (error) {
      console.error('[cartSettingsService] Get error:', error);
      throw new Error(`Failed to get settings: ${error.message}`);
    }
  },

  /**
   * Update cart settings
   * @param {string} id - Settings ID
   * @param {Object} updatedFields - Updated fields
   * @returns {Promise<Object>} Response
   */
  async update(id, updatedFields) {
    try {
      const payload = {
        ...updatedFields,
        status: validateStatus(updatedFields.status),
      };

      const response = await apiClient.put(`/update-cart-settings/${id}`, payload);
      return response;
    } catch (error) {
      console.error('[cartSettingsService] Update error:', error);
      throw new Error(`Failed to update settings: ${error.message}`);
    }
  },
};
