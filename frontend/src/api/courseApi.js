import apiClient from './axiosConfig';

const courseApi = {
  getAllCourses: () => apiClient.get('/courses'),
  getCourseById: (id) => apiClient.get(`/courses/${id}`),
  createCourse: (data) => apiClient.post('/courses', data),
  updateCourse: (id, data) => apiClient.put(`/courses/${id}`, data),
  deleteCourse: (id) => apiClient.delete(`/courses/${id}`),
  getCoursesForWeek: (startDate, endDate) => apiClient.get('/courses/week', { params: { startDate, endDate } })
};

export default courseApi;
