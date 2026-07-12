import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const rewardService = {
  /**
   * Get all rewards available in the shop
   */
  getRewards: async () => {
    const response = await axios.get(`${API_BASE_URL}/rewards`);
    return response.data;
  },

  /**
   * Redeem a reward item
   */
  redeemReward: async (rewardId) => {
    const response = await axios.post(`${API_BASE_URL}/rewards/${rewardId}/redeem`);
    return response.data;
  },

  /**
   * Get redemption history for current employee
   */
  getRedemptionHistory: async () => {
    const response = await axios.get(`${API_BASE_URL}/rewards/history`);
    return response.data;
  }
};

export default rewardService;
