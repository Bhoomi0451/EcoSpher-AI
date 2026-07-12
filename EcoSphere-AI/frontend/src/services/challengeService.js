import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const challengeService = {
  /**
   * Get all active ESG challenges
   */
  getActiveChallenges: async () => {
    const response = await axios.get(`${API_BASE_URL}/challenges`);
    return response.data;
  },

  /**
   * Join an ESG challenge
   */
  joinChallenge: async (challengeId) => {
    const response = await axios.post(`${API_BASE_URL}/challenges/${challengeId}/join`);
    return response.data;
  },

  /**
   * Submit activity / complete challenge
   */
  submitActivity: async (challengeId, submissionData) => {
    const response = await axios.post(`${API_BASE_URL}/challenges/${challengeId}/submit`, submissionData);
    return response.data;
  }
};

export default challengeService;
