// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

/**
 * API Request Helper
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'Something went wrong',
        errors: data.errors || [],
      };
    }

    return data;
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw {
      status: 500,
      message: error.message || 'Network error',
      errors: [],
    };
  }
};

/**
 * Auth API Services
 */
export const authAPI = {
  // Login user (job seeker or employer)
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Register job seeker
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Register employer
  registerEmployer: async (employerData) => {
    return apiRequest('/auth/register-employer', {
      method: 'POST',
      body: JSON.stringify(employerData),
    });
  },

  // Get current user
  getMe: async () => {
    return apiRequest('/auth/me');
  },

  // Logout
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },
};

/**
 * User API Services
 */
export const userAPI = {
  // Get user by ID
  getUser: async (id) => {
    return apiRequest(`/users/${id}`);
  },

  // Update profile
  updateProfile: async (profileData) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Delete account
  deleteAccount: async () => {
    return apiRequest('/users/profile', {
      method: 'DELETE',
    });
  },
};

/**
 * Auth Helper Functions
 */
export const authHelpers = {
  // Save token to localStorage
  saveToken: (token) => {
    localStorage.setItem('token', token);
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem('token');
  },

  // Save user data to localStorage
  saveUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get user from localStorage
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Remove user from localStorage
  removeUser: () => {
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Clear all auth data
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  helpers: authHelpers,
};
