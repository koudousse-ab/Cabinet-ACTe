import apiClient from './axiosConfig';

const dashboardApi = {
  getStats: () => apiClient.get('/dashboard/stats'),
  getCharts: () => apiClient.get('/dashboard/charts'),
  getRecentActivity: () => apiClient.get('/dashboard/recent')
};

export default dashboardApi;
