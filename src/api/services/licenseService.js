import apiClient from '@/api/apiClient';

export const licenseService = {
  async getStatus() {
    return await apiClient.get('/license/status');
  },

  async activate(licenseKey) {
    return await apiClient.post('/license/activate', { license_key: licenseKey });
  },

  async deactivate() {
    return await apiClient.post('/license/deactivate');
  }
};
