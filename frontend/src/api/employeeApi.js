import apiClient from './axiosConfig';

const employeeApi = {
  getAllEmployees: () => apiClient.get('/employees'),
  getEmployeeById: (id) => apiClient.get(`/employees/${id}`),
  createEmployee: (data) => apiClient.post('/employees', data),
  updateEmployee: (id, data) => apiClient.put(`/employees/${id}`, data),
  deleteEmployee: (id) => apiClient.delete(`/employees/${id}`),
  getEmployeeTasks: (id) => apiClient.get(`/employees/${id}/tasks`),
  getEmployeeErrors: (id) => apiClient.get(`/employees/${id}/errors`),
  addError: (data) => apiClient.post('/errors', data)
};

export default employeeApi;
