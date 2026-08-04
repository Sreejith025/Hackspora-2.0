import axios from 'axios';
import * as XLSX from 'xlsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/registrations';

export const registrationService = {
  // Check if Clerk user or email is already registered in MongoDB Atlas
  async checkRegistrationStatus(clerkId, email = '') {
    if (!clerkId && !email) {
      return { registered: false };
    }

    try {
      const targetId = clerkId || 'unauthenticated';
      const response = await axios.get(`${API_BASE_URL}/check/${targetId}`, {
        params: { email },
      });
      return response.data;
    } catch (err) {
      console.error('Error checking registration status:', err?.response?.data || err.message);
      return { registered: false };
    }
  },

  // Register team directly to MongoDB Atlas
  async registerTeam(teamData) {
    console.log('[Axios] Sending Registration Request to:', API_BASE_URL);
    console.log('[Axios] Registration Payload:', teamData);
    try {
      const response = await axios.post(API_BASE_URL, teamData);
      console.log('[Axios] Registration Response Received:', response.status, response.data);
      if (response.data?.success) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Registration failed');
    } catch (error) {
      console.error('[Axios] Registration POST Error:', error?.response?.data || error.message);
      throw error;
    }
  },

  // Fetch all registered teams from MongoDB Atlas (for Admin)
  async getAllRegistrations(params = {}) {
    const { search = '', college = 'All', sort = 'newest' } = params;
    const response = await axios.get(API_BASE_URL, {
      params: { search, college, sort },
    });
    return response.data;
  },

  // Fetch single team by user email from MongoDB Atlas
  async getMyTeam(email) {
    if (!email) return null;
    try {
      const response = await axios.get(`${API_BASE_URL}/my-team`, {
        params: { email },
      });
      if (response.data?.success) {
        return response.data.data;
      }
      return null;
    } catch (err) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  },

  // Fetch Dashboard Stats from MongoDB Atlas
  async getStats() {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    if (response.data?.success) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to load stats');
  },

  // Update single team status in MongoDB Atlas
  async updateStatus(id, status) {
    const response = await axios.put(`${API_BASE_URL}/${id}/status`, { status });
    if (response.data?.success) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to update status');
  },

  // Update team registration details in MongoDB Atlas
  async updateRegistration(id, updateData) {
    const response = await axios.put(`${API_BASE_URL}/${id}`, updateData);
    if (response.data?.success) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to update registration');
  },

  // Delete team registration from MongoDB Atlas
  async deleteRegistration(id) {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    if (response.data?.success) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Failed to delete team registration');
  },

  // Bulk update status in MongoDB Atlas
  async bulkUpdateStatus(ids, status) {
    const response = await axios.post(`${API_BASE_URL}/bulk-status`, { ids, status });
    if (response.data?.success) {
      return response.data;
    }
    throw new Error(response.data?.message || 'Failed to bulk update status');
  },

  // Bulk delete registrations from MongoDB Atlas
  async bulkDeleteRegistrations(ids) {
    const response = await axios.post(`${API_BASE_URL}/bulk-delete`, { ids });
    if (response.data?.success) {
      return response.data;
    }
    throw new Error(response.data?.message || 'Failed to bulk delete registrations');
  },

  // Export dataset to Real Excel (.xlsx) file using SheetJS
  exportToExcel(teamsData, filename = 'Hackspora_2.0_Registrations.xlsx') {
    const formattedData = teamsData.map((t) => {
      const members = t.members || [];
      const memberNames = members.map((m) => m.fullName).join(', ');
      const memberEmails = members.map((m) => m.email).join(', ');
      const memberPhones = members.map((m) => m.phone).join(', ');

      return {
        'Registration ID': t.teamId || '',
        'Team Name': t.teamName || '',
        'Status': t.status || 'Verified',
        'Leader Name': t.leaderName || '',
        'Leader Email': t.leaderEmail || '',
        'Leader Phone': t.leaderPhone || '',
        'College Name': t.collegeName || '',
        'Course': t.course || '',
        'Branch / Department': t.branch || '',
        'Year': t.year || '',
        'City': t.city || '',
        'State': t.state || '',
        'Total Team Members': 1 + members.length,
        'Squad Member Names': memberNames || 'None',
        'Squad Member Emails': memberEmails || 'None',
        'Squad Member Phones': memberPhones || 'None',
        'Registration Date': t.createdAt ? new Date(t.createdAt).toLocaleString() : '',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const columnWidths = Object.keys(formattedData[0] || {}).map((key) => ({
      wch: Math.max(key.length + 4, 18),
    }));
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    XLSX.writeFile(workbook, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
  },

  // Export dataset to CSV (.csv) file
  exportToCSV(teamsData, filename = 'Hackspora_2.0_Registrations.csv') {
    const formattedData = teamsData.map((t) => {
      const members = t.members || [];
      return {
        'Registration ID': t.teamId || '',
        'Team Name': t.teamName || '',
        'Status': t.status || 'Verified',
        'Leader Name': t.leaderName || '',
        'Leader Email': t.leaderEmail || '',
        'Leader Phone': t.leaderPhone || '',
        'College Name': t.collegeName || '',
        'Department': t.branch || '',
        'Year': t.year || '',
        'City': t.city || '',
        'State': t.state || '',
        'Members Count': 1 + members.length,
        'Member Details': members.map((m) => `${m.fullName} (${m.email})`).join('; '),
        'Registration Date': t.createdAt ? new Date(t.createdAt).toLocaleString() : '',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

