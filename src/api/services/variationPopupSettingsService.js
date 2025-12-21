/**
 * Variation Popup Settings Service Module
 *
 * Handles API requests for variation popup settings.
 *
 * @module api/services/variationPopupSettingsService
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
 * Variation Popup Settings Service
 */
export const variationPopupSettingsService = {
  /**
   * Save variation popup settings
   * @param {Object} settingsData - Settings data
   * @returns {Promise<Object>} Response
   */
  async save(settingsData) {
    try {
      const payload = {
        id: generateUniqueId(),
        createdAt: new Date().toISOString(),
        status: validateStatus(settingsData.status || 'on'),
        closeButtonBgColor: settingsData.closeButtonBgColor ?? '#f5f5f5',
        closeButtonIconColor: settingsData.closeButtonIconColor ?? '#666666',
        popupWidth: settingsData.popupWidth ?? 1000,
        addToCartButtonBgColor: settingsData.addToCartButtonBgColor ?? '#05291B',
        addToCartButtonTextColor: settingsData.addToCartButtonTextColor ?? '#ffffff',
      };

      const response = await apiClient.post('/save-variation-popup-settings', payload);
      return response;
    } catch (error) {
      console.error('[variationPopupSettingsService] Save error:', error);
      throw new Error(`Failed to save settings: ${error.message}`);
    }
  },

  /**
   * Get all variation popup settings
   * @returns {Promise<Object>} Settings data
   */
  async get() {
    try {
      return await apiClient.get('/get-variation-popup-settings');
    } catch (error) {
      console.error('[variationPopupSettingsService] Get error:', error);
      throw new Error(`Failed to get settings: ${error.message}`);
    }
  },

  /**
   * Update variation popup settings
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

      const response = await apiClient.put(`/update-variation-popup-settings/${id}`, payload);
      return response;
    } catch (error) {
      console.error('[variationPopupSettingsService] Update error:', error);
      throw new Error(`Failed to update settings: ${error.message}`);
    }
  },
};
