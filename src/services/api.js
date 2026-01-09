const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Authentication API
export const authAPI = {
  register: async (name, email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Settings API
export const settingsAPI = {
  get: async () => {
    return apiRequest('/settings');
  },

  update: async (farmName, logo) => {
    return apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify({ farmName, logo }),
    });
  },
};

// Batches API
export const batchesAPI = {
  getAll: async () => {
    return apiRequest('/batches');
  },

  create: async (batchData) => {
    return apiRequest('/batches', {
      method: 'POST',
      body: JSON.stringify(batchData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/batches/${id}`, {
      method: 'DELETE',
    });
  },
};

// Section Records API
export const sectionAPI = {
  getAll: async (section) => {
    return apiRequest(`/sections/${section}`);
  },

  create: async (section, recordData) => {
    return apiRequest(`/sections/${section}`, {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  },

  delete: async (section, id) => {
    return apiRequest(`/sections/${section}/${id}`, {
      method: 'DELETE',
    });
  },
};
