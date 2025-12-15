/**
 * General Settings Service Module
 *
 * Handles API requests for general plugin settings.
 *
 * @module api/services/generalSettingsService
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
 * General Settings Service
 */
export const generalSettingsService = {
  /**
   * Save general settings
   * @param {Object} settingsData - Settings data
   * @returns {Promise<Object>} Response
   */
  async save(settingsData) {
    try {
      const payload = {
        id: generateUniqueId(),
        createdAt: new Date().toISOString(),
        status: validateStatus(settingsData.status || 'on'),
        enableQuickCart: settingsData.enableQuickCart ?? true,
        enableVarProduct: settingsData.enableVarProduct ?? true,
        enableDragAndDrop: settingsData.enableDragAndDrop ?? true,
        enableDirectCheckout: settingsData.enableDirectCheckout ?? true,
      };

      const response = await apiClient.post('/save-general-settings', payload);
      return response;
    } catch (error) {
      console.error('[generalSettingsService] Save error:', error);
      throw new Error(`Failed to save settings: ${error.message}`);
    }
  },

  /**
   * Get all general settings
   * @returns {Promise<Object>} Settings data
   */
  async get() {
    try {
      return await apiClient.get('/get-general-settings');
    } catch (error) {
      console.error('[generalSettingsService] Get error:', error);
      throw new Error(`Failed to get settings: ${error.message}`);
    }
  },

  /**
   * Update general settings
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

      const response = await apiClient.put(`/update-general-settings/${id}`, payload);
      return response;
    } catch (error) {
      console.error('[generalSettingsService] Update error:', error);
      throw new Error(`Failed to update settings: ${error.message}`);
    }
  },
};
