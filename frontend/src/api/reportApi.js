import apiClient from './axiosConfig';

const reportApi = {
  getWeeklyReport: (weekStart) => apiClient.get('/reports/weekly', { params: { weekStart } }),
  exportPDF: (weekStart, enseignantId) =>
    apiClient.get('/reports/weekly/export', {
      params: { weekStart, enseignantId },
      responseType: 'blob'
    })
};

export default reportApi;
