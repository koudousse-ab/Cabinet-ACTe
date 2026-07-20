import apiClient from './axiosConfig';

const reportApi = {
  getWeeklyReport: (weekStart) => apiClient.get('/reports/weekly', { params: { weekStart } }),
  exportPDF: (weekStart, employeeId) =>
    apiClient.get('/reports/weekly/export', {
      params: { weekStart, employeeId },
      responseType: 'blob'
    })
};

export default reportApi;
