import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const badgeService = {
  /**
   * Retrieve all badges configured in EcoSphere
   */
  getAllBadges: async () => {
    const response = await axios.get(`${API_BASE_URL}/badges`);
    return response.data;
  },

  /**
   * Retrieve earned badges for the current employee
   */
  getEarnedBadges: async () => {
    const response = await axios.get(`${API_BASE_URL}/badges/earned`);
    return response.data;
  }
};

export default badgeService;
