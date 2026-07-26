import apiClient from './axiosConfig';

const projectApi = {
  getAllProjects: (params) => apiClient.get('/projects', { params }),
  getProjectById: (id) => apiClient.get(`/projects/${id}`),
  createProject: (data) => apiClient.post('/projects', data),
  updateProject: (id, data) => apiClient.put(`/projects/${id}`, data),
  deleteProject: (id) => apiClient.delete(`/projects/${id}`),
  getProjectTasks: (id) => apiClient.get(`/projects/${id}/tasks`),
  searchProjects: (q) => apiClient.get('/projects/search', { params: { q } })
};

export default projectApi;
