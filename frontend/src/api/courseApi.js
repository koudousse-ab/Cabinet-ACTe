import apiClient from './axiosConfig';

const courseApi = {
  getAllCourses: () => apiClient.get('/courses'),
  getCourseById: (id) => apiClient.get(`/courses/${id}`),
  createCourse: (data) => apiClient.post('/courses', data),
  updateCourse: (id, data) => apiClient.put(`/courses/${id}`, data),
  deleteCourse: (id) => apiClient.delete(`/courses/${id}`),
  getCoursesForWeek: (startDate, endDate) => apiClient.get('/courses/week', { params: { startDate, endDate } }),
  getCoursesByAssignedTo: (enseignantId) => apiClient.get(`/courses/assigned/${enseignantId}`),
  getCoursesByClasse: (classe) => apiClient.get(`/courses/classe/${encodeURIComponent(classe)}`),
  getCoursesByEtudiant: (etudiantId) => apiClient.get(`/courses/etudiant/${etudiantId}`),
  updateCourseStatus: (id, status) => apiClient.patch(`/courses/${id}/status`, null, { params: { status } })
};

export default courseApi;
