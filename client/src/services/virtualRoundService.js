import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Virtual Round Control API Service
 */
export const virtualRoundService = {
  // Fetch round status and metrics
  async getRoundStatus() {
    try {
      const response = await axios.get(`${API_BASE_URL}/virtual-round/status`);
      return response.data;
    } catch {
      console.warn('API unavailable, returning default Virtual Round state');
      return null;
    }
  },

  // Update round configuration
  async updateConfiguration(configData) {
    const response = await axios.post(`${API_BASE_URL}/virtual-round/config`, configData);
    return response.data;
  },

  // Trigger round control actions (start, pause, resume, end, lock, release)
  async executeControlAction(actionType, params = {}) {
    const response = await axios.post(`${API_BASE_URL}/virtual-round/action`, {
      action: actionType,
      ...params,
    });
    return response.data;
  },

  // Fetch live activity feed
  async getActivityLogs() {
    try {
      const response = await axios.get(`${API_BASE_URL}/virtual-round/activity`);
      return response.data;
    } catch {
      return [];
    }
  },
};
