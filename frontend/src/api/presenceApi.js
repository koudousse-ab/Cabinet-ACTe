import apiClient from './axiosConfig';

const presenceApi = {
  getOnlineUsers: () => apiClient.get('/presence/online')
};

export default presenceApi;
