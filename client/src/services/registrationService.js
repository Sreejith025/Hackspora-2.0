import axios from 'axios';
import * as XLSX from 'xlsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/registrations';

export const registrationService = {
  // Check if Clerk user or email is already registered in MongoDB
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
      console.error('Check registration status failed:', err?.response?.data || err.message);
      return { registered: false };
    }
  },

  // Register team directly into MongoDB
  async registerTeam(teamData) {
    try {
      const response = await axios.post(API_BASE_URL, teamData);
      if (response.data?.success) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Failed to register team.');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Server error during registration.';
      console.error('Register team error:', errorMessage);
      throw new Error(errorMessage, { cause: err });
    }
  },

  // Fetch all registered teams from MongoDB (for Admin)
  async getAllRegistrations(params = {}) {
    const { search = '', college = 'All', sort = 'newest' } = params;
    try {
      const response = await axios.get(API_BASE_URL, {
        params: { search, college, sort },
      });
      if (response.data?.success) {
        return response.data;
      }
      return { success: true, count: 0, data: [] };
    } catch (err) {
      console.error('Get all registrations error:', err?.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to fetch registrations from MongoDB.', { cause: err });
    }
  },

  // Fetch single team by user email from MongoDB
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
      if (err.response?.status === 404) {
        return null;
      }
      console.error('Get my team error:', err?.response?.data || err.message);
      return null;
    }
  },

  // Fetch Dashboard Stats directly from MongoDB
  async getStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats`);
      if (response.data?.success) {
        return response.data.data;
      }
      return {
        totalTeams: 0,
        targetTeams: 250,
        totalParticipants: 0,
        totalColleges: 0,
        verifiedTeams: 0,
        pendingTeams: 0,
        rejectedTeams: 0,
        todayRegistrations: 0,
        avgTeamSize: '0',
        topCollege: 'N/A',
        latestRegistration: null,
      };
    } catch (err) {
      console.error('Get stats error:', err?.response?.data || err.message);
      return {
        totalTeams: 0,
        targetTeams: 250,
        totalParticipants: 0,
        totalColleges: 0,
        verifiedTeams: 0,
        pendingTeams: 0,
        rejectedTeams: 0,
        todayRegistrations: 0,
        avgTeamSize: '0',
        topCollege: 'N/A',
        latestRegistration: null,
      };
    }
  },

  // Update single team status in MongoDB
  async updateStatus(id, status) {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}/status`, { status });
      if (response.data?.success) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Failed to update status');
    } catch (err) {
      console.error('Update status error:', err?.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to update team status', { cause: err });
    }
  },

  // Update team registration details in MongoDB
  async updateRegistration(id, updateData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, updateData);
      if (response.data?.success) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Failed to update registration');
    } catch (err) {
      console.error('Update registration error:', err?.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to update team details', { cause: err });
    }
  },

  // Delete team registration from MongoDB
  async deleteRegistration(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`);
      if (response.data?.success) {
        return response.data;
      }
      throw new Error(response.data?.message || 'Failed to delete team');
    } catch (err) {
      console.error('Delete registration error:', err?.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to delete team registration', { cause: err });
    }
  },

  // Bulk update status in MongoDB
  async bulkUpdateStatus(ids, status) {
    try {
      const response = await axios.post(`${API_BASE_URL}/bulk-status`, { ids, status });
      if (response.data?.success) {
        return response.data;
      }
      throw new Error(response.data?.message || 'Bulk update failed');
    } catch (err) {
      console.error('Bulk update status error:', err?.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to bulk update statuses', { cause: err });
    }
  },

  // Bulk delete registrations from MongoDB
  async bulkDeleteRegistrations(ids) {
    try {
      const response = await axios.post(`${API_BASE_URL}/bulk-delete`, { ids });
      if (response.data?.success) {
        return response.data;
      }
      throw new Error(response.data?.message || 'Bulk delete failed');
    } catch (err) {
      console.error('Bulk delete error:', err?.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to bulk delete registrations', { cause: err });
    }
  },

  // Export dataset to Real Excel (.xlsx) file using SheetJS
  exportToExcel(teamsData, filename = 'Hackspora_2.0_Registrations.xlsx') {
    if (!teamsData || teamsData.length === 0) {
      alert('No registrations available to export.');
      return;
    }

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
    if (!teamsData || teamsData.length === 0) {
      alert('No registrations available to export.');
      return;
    }

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
