import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const csrService = {
  /**
   * Get all CSR submissions by this employee
   */
  getMySubmissions: async () => {
    const response = await axios.get(`${API_BASE_URL}/csr/my-submissions`);
    return response.data;
  },

  /**
   * Submit a new CSR activity report with optional file attachment
   */
  submitActivityReport: async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/csr/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default csrService;
