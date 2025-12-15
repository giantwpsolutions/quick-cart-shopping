/**
 * Layout Settings Service Module
 *
 * Handles API requests for layout plugin settings.
 *
 * @module api/services/layoutSettingsService
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
 * Validate cart option
 * @param {string} cartOption - Cart option value
 * @returns {string} Valid cart option
 */
const validateCartOption = (cartOption) =>
  ['side', 'popup', 'drawer'].includes(cartOption) ? cartOption : 'side';

/**
 * Validate animation
 * @param {string} animation - Animation value
 * @returns {string} Valid animation
 */
const validateAnimation = (animation) =>
  ['slide', 'fade', 'slide-fade', 'bounce'].includes(animation) ? animation : 'slide';

/**
 * Layout Settings Service
 */
export const layoutSettingsService = {
  /**
   * Save layout settings
   * @param {Object} settingsData - Settings data
   * @returns {Promise<Object>} Response
   */
  async save(settingsData) {
    try {
      const payload = {
        id: generateUniqueId(),
        createdAt: new Date().toISOString(),
        status: validateStatus(settingsData.status || 'on'),
        cartOption: validateCartOption(settingsData.cartOption),
        cartWidth: settingsData.cartWidth ?? 400,
        animation: validateAnimation(settingsData.animation),
      };

      const response = await apiClient.post('/save-layout-settings', payload);
      return response;
    } catch (error) {
      console.error('[layoutSettingsService] Save error:', error);
      throw new Error(`Failed to save settings: ${error.message}`);
    }
  },

  /**
   * Get all layout settings
   * @returns {Promise<Object>} Settings data
   */
  async get() {
    try {
      return await apiClient.get('/get-layout-settings');
    } catch (error) {
      console.error('[layoutSettingsService] Get error:', error);
      throw new Error(`Failed to get settings: ${error.message}`);
    }
  },

  /**
   * Update layout settings
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

      const response = await apiClient.put(`/update-layout-settings/${id}`, payload);
      return response;
    } catch (error) {
      console.error('[layoutSettingsService] Update error:', error);
      throw new Error(`Failed to update settings: ${error.message}`);
    }
  },
};
