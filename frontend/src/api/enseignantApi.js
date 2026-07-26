import apiClient from './axiosConfig';

const enseignantApi = {
  getAllEnseignants: () => apiClient.get('/enseignants'),
  getEnseignantById: (id) => apiClient.get(`/enseignants/${id}`),
  createEnseignant: (data) => apiClient.post('/enseignants', data),
  updateEnseignant: (id, data) => apiClient.put(`/enseignants/${id}`, data),
  deleteEnseignant: (id) => apiClient.delete(`/enseignants/${id}`),
  getEnseignantTasks: (id) => apiClient.get(`/enseignants/${id}/tasks`),
  getEnseignantErrors: (id) => apiClient.get(`/enseignants/${id}/errors`),
  addError: (data) => apiClient.post('/errors', data),
  searchEnseignants: (q) => apiClient.get('/enseignants/search', { params: { q } })
};

export default enseignantApi;
