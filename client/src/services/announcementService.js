import axios from 'axios';
import { getRootApiUrl } from './apiConfig';

const API_BASE_URL = getRootApiUrl();

/**
 * Announcement API Service
 * Handles CRUD and publish/unpublish operations for Hackspora 2.0 Announcements.
 */
export const announcementService = {
  /**
   * Get all published announcements (Public / Participant)
   */
  async getPublishedAnnouncements() {
    try {
      const response = await axios.get(`${API_BASE_URL}/announcements/published`);
      return response.data;
    } catch (error) {
      console.error('Error fetching published announcements:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  /**
   * Get all announcements including drafts (Admin only)
   */
  async getAdminAnnouncements(adminEmail) {
    try {
      const response = await axios.get(`${API_BASE_URL}/announcements/admin`, {
        headers: { 'x-admin-email': adminEmail },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching admin announcements:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  /**
   * Create a new announcement (Admin only)
   */
  async createAnnouncement(announcementData, adminEmail) {
    const response = await axios.post(
      `${API_BASE_URL}/announcements`,
      { ...announcementData, adminEmail },
      { headers: { 'x-admin-email': adminEmail } }
    );
    return response.data;
  },

  /**
   * Update an existing announcement (Admin only)
   */
  async updateAnnouncement(id, announcementData, adminEmail) {
    const response = await axios.put(
      `${API_BASE_URL}/announcements/${id}`,
      { ...announcementData, adminEmail },
      { headers: { 'x-admin-email': adminEmail } }
    );
    return response.data;
  },

  /**
   * Delete an announcement (Admin only)
   */
  async deleteAnnouncement(id, adminEmail) {
    const response = await axios.delete(`${API_BASE_URL}/announcements/${id}`, {
      headers: { 'x-admin-email': adminEmail },
      data: { adminEmail },
    });
    return response.data;
  },

  /**
   * Toggle or set publish status (Admin only)
   */
  async togglePublishStatus(id, status, adminEmail) {
    const response = await axios.patch(
      `${API_BASE_URL}/announcements/${id}/publish`,
      { status, adminEmail },
      { headers: { 'x-admin-email': adminEmail } }
    );
    return response.data;
  },
};
