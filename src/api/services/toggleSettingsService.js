/**
 * Toggle Settings Service Module
 *
 * Handles API requests for toggle plugin settings.
 *
 * @module api/services/toggleSettingsService
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
 * Validate icon position
 * @param {string} position - Position value
 * @returns {string} Valid position
 */
const validateIconPosition = (position) =>
  ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(position) ? position : 'bottom-right';

/**
 * Validate icon style
 * @param {string} style - Style value
 * @returns {string} Valid style
 */
const validateIconStyle = (style) =>
  ['cart', 'cart-solid', 'bag', 'bag-solid'].includes(style) ? style : 'cart';

/**
 * Validate border shape
 * @param {string} shape - Shape value
 * @returns {string} Valid shape
 */
const validateBorderShape = (shape) =>
  ['none', 'circle', 'rounded'].includes(shape) ? shape : 'circle';

/**
 * Toggle Settings Service
 */
export const toggleSettingsService = {
  /**
   * Save toggle settings
   * @param {Object} settingsData - Settings data
   * @returns {Promise<Object>} Response
   */
  async save(settingsData) {
    try {
      const payload = {
        id: generateUniqueId(),
        createdAt: new Date().toISOString(),
        status: validateStatus(settingsData.status || 'on'),
        iconPosition: validateIconPosition(settingsData.iconPosition),
        iconStyle: validateIconStyle(settingsData.iconStyle),
        iconSize: settingsData.iconSize ?? 60,
        showBadge: settingsData.showBadge ?? true,
        badgeBgColor: settingsData.badgeBgColor ?? '#3498db',
        badgeTextColor: settingsData.badgeTextColor ?? '#ffffff',
        iconBgColor: settingsData.iconBgColor ?? '#05291B',
        iconColor: settingsData.iconColor ?? '#ffffff',
        hideOnPages: settingsData.hideOnPages ?? [],
        borderShape: validateBorderShape(settingsData.borderShape),
        offsetTop: settingsData.offsetTop ?? 20,
        offsetBottom: settingsData.offsetBottom ?? 20,
        offsetLeft: settingsData.offsetLeft ?? 20,
        offsetRight: settingsData.offsetRight ?? 20,
      };

      const response = await apiClient.post('/save-toggle-settings', payload);
      return response;
    } catch (error) {
      console.error('[toggleSettingsService] Save error:', error);
      throw new Error(`Failed to save settings: ${error.message}`);
    }
  },

  /**
   * Get all toggle settings
   * @returns {Promise<Object>} Settings data
   */
  async get() {
    try {
      return await apiClient.get('/get-toggle-settings');
    } catch (error) {
      console.error('[toggleSettingsService] Get error:', error);
      throw new Error(`Failed to get settings: ${error.message}`);
    }
  },

  /**
   * Update toggle settings
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

      const response = await apiClient.put(`/update-toggle-settings/${id}`, payload);
      return response;
    } catch (error) {
      console.error('[toggleSettingsService] Update error:', error);
      throw new Error(`Failed to update settings: ${error.message}`);
    }
  },
};
