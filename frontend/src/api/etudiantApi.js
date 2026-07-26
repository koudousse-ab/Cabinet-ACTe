import apiClient from './axiosConfig';

const etudiantApi = {
  getAllEtudiants: () => apiClient.get('/etudiants'),
  getEtudiantById: (id) => apiClient.get(`/etudiants/${id}`),
  createEtudiant: (data) => apiClient.post('/etudiants', data),
  updateEtudiant: (id, data) => apiClient.put(`/etudiants/${id}`, data),
  deleteEtudiant: (id) => apiClient.delete(`/etudiants/${id}`),
  searchEtudiants: (q) => apiClient.get('/etudiants/search', { params: { q } }),
  getProgramme: (id) => apiClient.get(`/etudiants/${id}/programme`),
  getMe: () => apiClient.get('/etudiants/me')
};

export default etudiantApi;
