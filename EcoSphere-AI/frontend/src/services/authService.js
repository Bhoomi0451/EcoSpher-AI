import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const authService = {
  /**
   * Log user in with email and password
   */
  login: async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
  },

  /**
   * Register a new employee account
   */
  register: async (name, email, password, department) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      name,
      email,
      password,
      department,
      role: 'Employee' // Standard default role for employee frontend
    });
    return response.data;
  },

  /**
   * Fetch current user profile details
   */
  getProfile: async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`);
    return response.data;
  }
};

export default authService;
