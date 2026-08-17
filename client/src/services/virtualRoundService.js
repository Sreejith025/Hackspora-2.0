import axios from 'axios';
import { getRootApiUrl } from './apiConfig';

const API_BASE_URL = `${getRootApiUrl()}/virtual-round`;

/**
 * Virtual Round API Service
 */
export const virtualRoundService = {
  // Fetch round status and metrics (Public)
  async getRoundConfig() {
    try {
      const response = await axios.get(`${API_BASE_URL}/config`);
      return response.data;
    } catch (err) {
      console.warn('API unavailable, returning default Virtual Round state:', err.message);
      return null;
    }
  },

  // Fetch my team's submission details (Participant)
  async getMySubmission(email) {
    if (!email) return null;
    try {
      const response = await axios.get(`${API_BASE_URL}/my-submission`, {
        params: { email },
      });
      return response.data;
    } catch (err) {
      console.error('Error fetching my submission:', err?.response?.data || err.message);
      return null;
    }
  },

  // Submit project details (Participant) - JSON payload (githubLink, videoLink, pptLink)
  async submitProject(payload) {
    try {
      const response = await axios.post(`${API_BASE_URL}/submit`, payload);
      return response.data;
    } catch (err) {
      console.error('Submit project error:', err?.response?.data || err.message);
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.msg;

      if (serverMessage) {
        throw new Error(serverMessage, { cause: err });
      }
      if (!err.response) {
        throw new Error('Unable to connect to backend server. Please make sure the backend server is running on port 5000.', { cause: err });
      }
      throw new Error(err.message || 'Failed to submit project for Virtual Round. Please try again.', { cause: err });
    }
  },

  // Fetch public shortlisted results (Public - strictly hides rejected status)
  async getPublicResults() {
    try {
      const response = await axios.get(`${API_BASE_URL}/public-results`);
      return response.data;
    } catch (err) {
      console.error('Error fetching public results:', err?.response?.data || err.message);
      return { success: false, data: [] };
    }
  },

  // ADMIN: Fetch all submissions
  async getAdminSubmissions(adminEmail, params = {}) {
    const { search = '', status = 'All' } = params;
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/submissions`, {
        params: { search, status, adminEmail },
        headers: { 'x-admin-email': adminEmail },
      });
      return response.data;
    } catch (err) {
      console.error('Admin fetch submissions error:', err?.response?.data || err.message);
      throw err;
    }
  },

  // ADMIN: Assign, change, or remove evaluator (PATCH /api/virtual-round/admin/submissions/:id/evaluator)
  async assignEvaluator(id, evaluatorName, adminEmail) {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/admin/submissions/${id}/evaluator`,
        { evaluatorName, adminEmail },
        { headers: { 'x-admin-email': adminEmail } }
      );
      return response.data;
    } catch (err) {
      console.error('Admin assign evaluator error:', err?.response?.data || err.message);
      throw new Error(err?.response?.data?.message || 'Failed to assign evaluator.', { cause: err });
    }
  },

  // ADMIN: Update submission status (under_review, shortlisted, rejected)
  async updateSubmissionStatus(id, status, adminEmail) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/submissions/${id}/status`,
        { status, adminEmail },
        { headers: { 'x-admin-email': adminEmail } }
      );
      return response.data;
    } catch (err) {
      console.error('Admin update status error:', err?.response?.data || err.message);
      throw new Error(err?.response?.data?.message || 'Failed to update submission status.', { cause: err });
    }
  },

  // ADMIN: Update round control configuration (Start/release round, close submissions, deadline, guidelines)
  async updateRoundConfig(configData, adminEmail) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/config`,
        { ...configData, adminEmail },
        { headers: { 'x-admin-email': adminEmail } }
      );
      return response.data;
    } catch (err) {
      console.error('Admin update config error:', err?.response?.data || err.message);
      throw new Error(err?.response?.data?.message || 'Failed to update round configuration.', { cause: err });
    }
  },

  // ADMIN: Lock or Open Virtual Round submissions
  async updateSubmissionStatusControl(submissionOpen, adminEmail) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/submission-status`,
        { submissionOpen, adminEmail },
        { headers: { 'x-admin-email': adminEmail } }
      );
      return response.data;
    } catch (err) {
      console.error('Admin update submission status error:', err?.response?.data || err.message);
      throw new Error(err?.response?.data?.message || 'Failed to update submission status control.', { cause: err });
    }
  },

  // ADMIN: Fetch Virtual Round stats
  async getAdminStats(adminEmail) {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/stats`, {
        params: { adminEmail },
        headers: { 'x-admin-email': adminEmail },
      });
      return response.data;
    } catch (err) {
      console.error('Admin get stats error:', err?.response?.data || err.message);
      return null;
    }
  },

  // ADMIN: Fetch registered teams with pre-assigned evaluator details
  async getAdminTeamsEvaluators(adminEmail) {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/teams-evaluators`, {
        params: { adminEmail },
        headers: { 'x-admin-email': adminEmail },
      });
      return response.data;
    } catch (err) {
      console.error('Admin fetch teams evaluators error:', err?.response?.data || err.message);
      return { success: false, data: [] };
    }
  },

  // ADMIN: Pre-assign evaluator to a team before Virtual Round
  async assignTeamEvaluator(teamId, evaluatorName, adminEmail) {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/admin/teams/${teamId}/evaluator`,
        { evaluatorName, adminEmail },
        { headers: { 'x-admin-email': adminEmail } }
      );
      return response.data;
    } catch (err) {
      console.error('Admin assign team evaluator error:', err?.response?.data || err.message);
      throw new Error(err?.response?.data?.message || 'Failed to assign team evaluator.', { cause: err });
    }
  },

  // PROBLEM STATEMENTS: Fetch published problem statements (Public/Participant)
  async getPublishedProblemStatements() {
    try {
      const psUrl = API_BASE_URL.replace(/\/virtual-round\/?$/, '/problem-statements');
      const response = await axios.get(`${psUrl}/published`);
      return response.data;
    } catch (err) {
      console.error('Error fetching published problem statements:', err?.response?.data || err.message);
      return { success: false, data: [] };
    }
  },

  // PROBLEM STATEMENTS: Fetch all problem statements (Admin)
  async getAdminProblemStatements(adminEmail) {
    try {
      const psUrl = API_BASE_URL.replace(/\/virtual-round\/?$/, '/problem-statements');
      const response = await axios.get(psUrl, {
        params: { adminEmail },
        headers: { 'x-admin-email': adminEmail },
      });
      return response.data;
    } catch (err) {
      console.error('Admin fetch problem statements error:', err?.response?.data || err.message);
      return { success: false, data: [] };
    }
  },

  // PROBLEM STATEMENTS: Create problem statement (Admin)
  async createProblemStatement(data, adminEmail) {
    try {
      const psUrl = API_BASE_URL.replace(/\/virtual-round\/?$/, '/problem-statements');
      const response = await axios.post(psUrl, { ...data, adminEmail }, {
        headers: { 'x-admin-email': adminEmail },
      });
      return response.data;
    } catch (err) {
      console.error('Admin create problem statement error:', err?.response?.data || err.message);
      throw new Error(err?.response?.data?.message || 'Failed to create problem statement.', { cause: err });
    }
  },

  // PROBLEM STATEMENTS: Edit problem statement (Admin)
  async updateProblemStatement(id, data, adminEmail) {
    try {
      const psUrl = API_BASE_URL.replace(/\/virtual-round\/?$/, '/problem-statements');
      const response = await axios.patch(`${psUrl}/${id}`, { ...data, adminEmail }, {
        headers: { 'x-admin-email': adminEmail },
      });
      return response.data;
    } catch (err) {
      console.error('Admin update problem statement error:', err?.response?.data || err.message);
      throw new Error(err?.response?.data?.message || 'Failed to update problem statement.', { cause: err });
    }
  },

  // PROBLEM STATEMENTS: Toggle publish/unpublish status (Admin)
  async togglePublishProblemStatement(id, status, adminEmail) {
    try {
      const psUrl = API_BASE_URL.replace(/\/virtual-round\/?$/, '/problem-statements');
      const action = status === 'published' ? 'publish' : 'unpublish';
      const response = await axios.patch(`${psUrl}/${id}/${action}`, { adminEmail }, {
        headers: { 'x-admin-email': adminEmail },
      });
      return response.data;
    } catch (err) {
      console.error(`Admin ${status} problem statement error:`, err?.response?.data || err.message);
      throw new Error(err?.response?.data?.message || `Failed to ${status} problem statement.`, { cause: err });
    }
  },

  // PROBLEM STATEMENTS: Delete problem statement (Admin)
  async deleteProblemStatement(id, adminEmail) {
    try {
      const psUrl = API_BASE_URL.replace(/\/virtual-round\/?$/, '/problem-statements');
      const response = await axios.delete(`${psUrl}/${id}`, {
        params: { adminEmail },
        headers: { 'x-admin-email': adminEmail },
      });
      return response.data;
    } catch (err) {
      console.error('Admin delete problem statement error:', err?.response?.data || err.message);
      throw new Error(err?.response?.data?.message || 'Failed to delete problem statement.', { cause: err });
    }
  },
};
