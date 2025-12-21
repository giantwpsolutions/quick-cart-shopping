/**
 * Checkout Settings Service Module
 *
 * Handles API requests for checkout plugin settings.
 *
 * @module api/services/checkoutSettingsService
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
 * Validate progress bar style
 * @param {string} style - Style value
 * @returns {string} Valid style
 */
const validateProgressBarStyle = (style) =>
  ['style1', 'style2', 'style3'].includes(style) ? style : 'style1';

/**
 * Validate thank you display option
 * @param {string} display - Display value
 * @returns {string} Valid display option
 */
const validateThankYouDisplay = (display) =>
  ['popup', 'page'].includes(display) ? display : 'popup';

/**
 * Checkout Settings Service
 */
export const checkoutSettingsService = {
  /**
   * Save checkout settings
   * @param {Object} settingsData - Settings data
   * @returns {Promise<Object>} Response
   */
  async save(settingsData) {
    try {
      const payload = {
        id: generateUniqueId(),
        createdAt: new Date().toISOString(),
        status: validateStatus(settingsData.status || 'on'),
        progressBarStyle: validateProgressBarStyle(settingsData.progressBarStyle),
        progressBarColor: settingsData.progressBarColor ?? '#05291B',
        progressLabelTextColor: settingsData.progressLabelTextColor ?? '#ffffff',
        progressLabelBgColor: settingsData.progressLabelBgColor ?? '#3498db',
        nextBtnBgColor: settingsData.nextBtnBgColor ?? '#05291B',
        nextBtnTextColor: settingsData.nextBtnTextColor ?? '#ffffff',
        previousBtnBgColor: settingsData.previousBtnBgColor ?? '#6b7280',
        previousBtnTextColor: settingsData.previousBtnTextColor ?? '#ffffff',
        backToCartBtnBgColor: settingsData.backToCartBtnBgColor ?? '#e5e7eb',
        backToCartBtnTextColor: settingsData.backToCartBtnTextColor ?? '#374151',
        enableThankYouPage: settingsData.enableThankYouPage ?? true,
        thankYouDisplay: validateThankYouDisplay(settingsData.thankYouDisplay),
        popupBgColor: settingsData.popupBgColor ?? '#ffffff',
        showOrderSummary: settingsData.showOrderSummary ?? true,
        thankYouPage: settingsData.thankYouPage ?? null,
      };

      const response = await apiClient.post('/save-checkout-settings', payload);
      return response;
    } catch (error) {
      console.error('[checkoutSettingsService] Save error:', error);
      throw new Error(`Failed to save settings: ${error.message}`);
    }
  },

  /**
   * Get all checkout settings
   * @returns {Promise<Object>} Settings data
   */
  async get() {
    try {
      return await apiClient.get('/get-checkout-settings');
    } catch (error) {
      console.error('[checkoutSettingsService] Get error:', error);
      throw new Error(`Failed to get settings: ${error.message}`);
    }
  },

  /**
   * Update checkout settings
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

      const response = await apiClient.put(`/update-checkout-settings/${id}`, payload);
      return response;
    } catch (error) {
      console.error('[checkoutSettingsService] Update error:', error);
      throw new Error(`Failed to update settings: ${error.message}`);
    }
  },
};
