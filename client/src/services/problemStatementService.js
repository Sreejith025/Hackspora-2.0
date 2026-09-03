import axios from 'axios';
import { getRootApiUrl } from './apiConfig';

const API_BASE_URL = getRootApiUrl();

/**
 * Problem Statement Management API Service
 */
export const problemStatementService = {
 // Category API Methods
 async getCategories() {
 try {
 const response = await axios.get(`${API_BASE_URL}/categories`);
 return response.data;
 } catch (error) {
 console.warn('API unavailable, returning default data structure:', error);
 return [];
 }
 },

 async createCategory(categoryData) {
 const response = await axios.post(`${API_BASE_URL}/categories`, categoryData);
 return response.data;
 },

 async updateCategory(id, categoryData) {
 const response = await axios.put(`${API_BASE_URL}/categories/${id}`, categoryData);
 return response.data;
 },

 async deleteCategory(id) {
 const response = await axios.delete(`${API_BASE_URL}/categories/${id}`);
 return response.data;
 },

 async toggleCategoryStatus(id, isActive) {
 const response = await axios.patch(`${API_BASE_URL}/categories/${id}/status`, { isActive });
 return response.data;
 },

  // Problem Statement API Methods
  async getProblemStatements(params = {}, adminEmail = 'abisri024@gmail.com') {
    try {
      const response = await axios.get(`${API_BASE_URL}/problem-statements`, {
        params: { ...params, adminEmail },
        headers: { 'x-admin-email': adminEmail },
      });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, returning default data structure:', error);
      return { success: false, data: [], total: 0 };
    }
  },

  async createProblemStatement(data, adminEmail = 'abisri024@gmail.com') {
    const response = await axios.post(`${API_BASE_URL}/problem-statements`, { ...data, adminEmail }, {
      headers: { 'x-admin-email': adminEmail },
    });
    return response.data;
  },

  async updateProblemStatement(id, data, adminEmail = 'abisri024@gmail.com') {
    const response = await axios.put(`${API_BASE_URL}/problem-statements/${id}`, { ...data, adminEmail }, {
      headers: { 'x-admin-email': adminEmail },
    });
    return response.data;
  },

  async deleteProblemStatement(id, adminEmail = 'abisri024@gmail.com') {
    const response = await axios.delete(`${API_BASE_URL}/problem-statements/${id}`, {
      params: { adminEmail },
      headers: { 'x-admin-email': adminEmail },
    });
    return response.data;
  },

  async duplicateProblemStatement(id, adminEmail = 'abisri024@gmail.com') {
    const response = await axios.post(`${API_BASE_URL}/problem-statements/${id}/duplicate`, { adminEmail }, {
      headers: { 'x-admin-email': adminEmail },
    });
    return response.data;
  },

  async togglePublishStatus(id, status, adminEmail = 'abisri024@gmail.com') {
    const action = status === 'published' ? 'publish' : 'unpublish';
    const response = await axios.patch(`${API_BASE_URL}/problem-statements/${id}/${action}`, { status, adminEmail }, {
      headers: { 'x-admin-email': adminEmail },
    });
    return response.data;
  },
};
