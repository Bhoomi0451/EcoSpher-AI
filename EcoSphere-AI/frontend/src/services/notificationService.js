import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const notificationService = {
  /**
   * Fetch all user-targeted notifications
   */
  getNotifications: async () => {
    const response = await axios.get(`${API_BASE_URL}/notifications`);
    return response.data;
  },

  /**
   * Mark a specific notification as read
   */
  markAsRead: async (notificationId) => {
    const response = await axios.patch(`${API_BASE_URL}/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    const response = await axios.post(`${API_BASE_URL}/notifications/read-all`);
    return response.data;
  }
};

export default notificationService;
