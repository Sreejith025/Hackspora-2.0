import axios from 'axios';

/**
 * Shared API Configuration & Live Base URL Resolution for Hackspora 2.0
 */
export const getRootApiUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocal =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01]))/.test(hostname);

    if (isLocal) {
      return `http://${hostname}:5000/api`;
    }
  }

  const envUrl =
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL;

  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    let clean = envUrl
      .trim()
      .replace(/\/+(registrations|virtual-round|problem-statements|categories|participant|announcements)\/?$/i, '')
      .replace(/\/+$/, '');
    if (!clean.endsWith('/api') && !clean.includes('/api/')) {
      clean = `${clean}/api`;
    }
    return clean;
  }

  return 'https://hackspora-2-0.onrender.com/api';
};

// Global Axios Interceptor to attach Clerk Bearer Token
axios.interceptors.request.use(
  async (config) => {
    try {
      if (typeof window !== 'undefined' && window.Clerk?.session) {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.error('[Axios Interceptor] Error retrieving Clerk token:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

