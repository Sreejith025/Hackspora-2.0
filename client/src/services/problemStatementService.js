import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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
  async getProblemStatements(params = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/problem-statements`, { params });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, returning default data structure:', error);
      return { data: [], total: 0 };
    }
  },

  async createProblemStatement(formData) {
    const response = await axios.post(`${API_BASE_URL}/problem-statements`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async updateProblemStatement(id, formData) {
    const response = await axios.put(`${API_BASE_URL}/problem-statements/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deleteProblemStatement(id) {
    const response = await axios.delete(`${API_BASE_URL}/problem-statements/${id}`);
    return response.data;
  },

  async duplicateProblemStatement(id) {
    const response = await axios.post(`${API_BASE_URL}/problem-statements/${id}/duplicate`);
    return response.data;
  },

  async togglePublishStatus(id, status) {
    const response = await axios.patch(`${API_BASE_URL}/problem-statements/${id}/publish`, { status });
    return response.data;
  },
};
