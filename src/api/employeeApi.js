import apiClient from './axiosConfig';

const employeeApi = {
  getAllEmployees: () => apiClient.get('/employees'),
  getEmployeeById: (id) => apiClient.get(`/employees/${id}`),
  createEmployee: (data) => apiClient.post('/employees', data),
  updateEmployee: (id, data) => apiClient.put(`/employees/${id}`, data),
  deleteEmployee: (id) => apiClient.delete(`/employees/${id}`)
};

export default employeeApi;
