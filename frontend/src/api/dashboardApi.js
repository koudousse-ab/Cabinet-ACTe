import apiClient from './axiosConfig';

const dashboardApi = {
  getStats: () => apiClient.get('/dashboard/stats'),
  getCharts: () => apiClient.get('/dashboard/charts'),
  getRecent: () => apiClient.get('/dashboard/recent')
};

export default dashboardApi;
