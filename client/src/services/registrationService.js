import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/registrations';

// Local storage key for persistent mock fallback
const LOCAL_STORAGE_KEY = 'hackspora_team_registrations';

// Initial Mock Seed Data if empty in localStorage
const DEFAULT_MOCK_TEAMS = [
  {
    _id: 'mock-1',
    teamId: 'HS2026-001',
    teamName: 'Galaxy Coders',
    leaderName: 'Abishek S',
    leaderEmail: 'abisri024@gmail.com',
    leaderPhone: '+91 9876543210',
    collegeName: 'Anna University',
    course: 'B.Tech',
    branch: 'Computer Science & Engineering',
    year: '4th Year',
    city: 'Chennai',
    state: 'Tamil Nadu',
    status: 'Verified',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    members: [
      {
        fullName: 'Priya Sharma',
        email: 'priya.s@gmail.com',
        phone: '+91 9876543211',
        github: 'https://github.com/priyasharma',
        collegeName: 'Anna University',
        course: 'B.Tech',
        branch: 'Information Technology',
        year: '4th Year',
        city: 'Chennai',
        state: 'Tamil Nadu',
      },
      {
        fullName: 'Rohan Verma',
        email: 'rohan.v@gmail.com',
        phone: '+91 9876543212',
        github: 'https://github.com/rohanv',
        collegeName: 'Anna University',
        course: 'B.Tech',
        branch: 'Computer Science',
        year: '3rd Year',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
      },
    ],
  },
  {
    _id: 'mock-2',
    teamId: 'HS2026-002',
    teamName: 'CyberPulse',
    leaderName: 'Kavya Nair',
    leaderEmail: 'kavya.nair@gmail.com',
    leaderPhone: '+91 9123456789',
    collegeName: 'IIT Madras',
    course: 'B.Tech',
    branch: 'AI & Data Science',
    year: '3rd Year',
    city: 'Chennai',
    state: 'Tamil Nadu',
    status: 'Verified',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    members: [
      {
        fullName: 'Aravind Swamy',
        email: 'aravind@gmail.com',
        phone: '+91 9123456790',
        github: 'https://github.com/aravindswamy',
        collegeName: 'IIT Madras',
        course: 'B.Tech',
        branch: 'AI & Data Science',
        year: '3rd Year',
        city: 'Madurai',
        state: 'Tamil Nadu',
      },
    ],
  },
  {
    _id: 'mock-3',
    teamId: 'HS2026-003',
    teamName: 'Astra Innovators',
    leaderName: 'Vikram Singh',
    leaderEmail: 'vikram.singh@gmail.com',
    leaderPhone: '+91 9988776655',
    collegeName: 'SRM Institute of Science and Technology',
    course: 'B.Tech',
    branch: 'Electronics & Communication',
    year: '4th Year',
    city: 'Kancheepuram',
    state: 'Tamil Nadu',
    status: 'Verified',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    members: [],
  },
];

function getLocalTeams() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_TEAMS));
      return DEFAULT_MOCK_TEAMS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_MOCK_TEAMS;
  }
}

function saveLocalTeams(teams) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(teams));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export const registrationService = {
  // Register team
  async registerTeam(teamData) {
    try {
      const response = await axios.post(API_BASE_URL, teamData, { timeout: 4000 });
      if (response.data?.success) {
        // Also sync local storage for offline state
        const local = getLocalTeams();
        saveLocalTeams([response.data.data, ...local]);
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline or slow, saving team locally', err?.message);
    }

    // Fallback: Generate local Team ID and store in localStorage
    const local = getLocalTeams();
    const nextNum = (local.length + 1).toString().padStart(3, '0');
    const teamId = `HS2026-${nextNum}`;

    const newTeam = {
      _id: `local-${Date.now()}`,
      teamId,
      ...teamData,
      status: 'Verified',
      createdAt: new Date().toISOString(),
    };

    saveLocalTeams([newTeam, ...local]);
    return newTeam;
  },

  // Fetch all registered teams (for Admin)
  async getAllRegistrations(params = {}) {
    const { search = '', college = 'All', sort = 'newest' } = params;
    try {
      const response = await axios.get(API_BASE_URL, {
        params: { search, college, sort },
        timeout: 4000,
      });
      if (response.data?.success) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend offline or slow, reading from local store', err?.message);
    }

    // Fallback local filtering & sorting
    let list = [...getLocalTeams()];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.teamId.toLowerCase().includes(q) ||
          t.teamName.toLowerCase().includes(q) ||
          t.leaderName.toLowerCase().includes(q) ||
          t.collegeName.toLowerCase().includes(q) ||
          t.leaderEmail.toLowerCase().includes(q)
      );
    }

    if (college && college !== 'All') {
      list = list.filter((t) => t.collegeName === college);
    }

    if (sort === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return {
      success: true,
      count: list.length,
      data: list,
    };
  },

  // Fetch single team by user email
  async getMyTeam(email) {
    if (!email) return null;
    try {
      const response = await axios.get(`${API_BASE_URL}/my-team`, {
        params: { email },
        timeout: 4000,
      });
      if (response.data?.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend offline, looking up team locally', err?.message);
    }

    // Fallback search local
    const local = getLocalTeams();
    const searchEmail = email.toLowerCase().trim();
    return (
      local.find(
        (t) =>
          t.leaderEmail.toLowerCase() === searchEmail ||
          t.members?.some((m) => m.email.toLowerCase() === searchEmail)
      ) || null
    );
  },

  // Fetch Dashboard Stats
  async getStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats`, { timeout: 4000 });
      if (response.data?.success) {
        return response.data.data;
      }
    } catch {
      console.warn('Backend offline, computing stats locally');
    }

    const list = getLocalTeams();
    let totalParticipants = 0;
    const colleges = new Set();

    list.forEach((t) => {
      totalParticipants += 1 + (t.members ? t.members.length : 0);
      if (t.collegeName) colleges.add(t.collegeName.trim());
      if (t.members) {
        t.members.forEach((m) => {
          if (m.collegeName) colleges.add(m.collegeName.trim());
        });
      }
    });

    const latestTeam = list.length > 0 ? list[0] : null;

    return {
      totalTeams: list.length,
      targetTeams: 250,
      totalParticipants,
      totalColleges: colleges.size,
      latestRegistration: latestTeam
        ? {
            teamName: latestTeam.teamName,
            teamId: latestTeam.teamId,
            registeredAt: latestTeam.createdAt,
          }
        : null,
    };
  },
};
