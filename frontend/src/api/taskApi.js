import apiClient from './axiosConfig';

const taskApi = {
  getAllTasks: () => apiClient.get('/tasks'),

  getTaskById: (id) => apiClient.get(`/tasks/${id}`),

  createTask: (taskData) => apiClient.post('/tasks', taskData),

  updateTask: (id, taskData) => apiClient.put(`/tasks/${id}`, taskData),

  deleteTask: (id) => apiClient.delete(`/tasks/${id}`),

  getTasksByProjectId: (projectId) => apiClient.get(`/tasks/project/${projectId}`),

  getTasksByAssignedTo: (enseignantId) => apiClient.get(`/tasks/assigned/${enseignantId}`),

  getTasksByStatus: (status) => apiClient.get(`/tasks/status/${status}`),

  getTasksByPriority: (priority) => apiClient.get(`/tasks/priority/${priority}`),

  getTasksByProjectAndStatus: (projectId, status) =>
    apiClient.get(`/tasks/project/${projectId}/status/${status}`),

  getOverdueTasks: () => apiClient.get('/tasks/overdue'),

  getUpcomingTasks: (startDate, endDate) =>
    apiClient.get('/tasks/upcoming', { params: { startDate, endDate } }),

  updateTaskStatus: (id, status) => apiClient.patch(`/tasks/${id}/status/${status}`),

  getTaskCountByStatus: (projectId, status) =>
    apiClient.get(`/tasks/count/project/${projectId}/status/${status}`),

  searchTasks: (q) => apiClient.get('/tasks/search', { params: { q } })
};

export default taskApi;
