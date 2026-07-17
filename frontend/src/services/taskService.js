import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

const taskService = {
  /**
   * Create a new task
   */
  createTask: (taskData) => {
    return axios.post(`${API_BASE_URL}/tasks`, taskData);
  },

  /**
   * Get task by ID
   */
  getTaskById: (id) => {
    return axios.get(`${API_BASE_URL}/tasks/${id}`);
  },

  /**
   * Get all tasks
   */
  getAllTasks: () => {
    return axios.get(`${API_BASE_URL}/tasks`);
  },

  /**
   * Update task
   */
  updateTask: (id, taskData) => {
    return axios.put(`${API_BASE_URL}/tasks/${id}`, taskData);
  },

  /**
   * Delete task
   */
  deleteTask: (id) => {
    return axios.delete(`${API_BASE_URL}/tasks/${id}`);
  },

  /**
   * Get tasks by project ID
   */
  getTasksByProjectId: (projectId) => {
    return axios.get(`${API_BASE_URL}/tasks/project/${projectId}`);
  },

  /**
   * Get tasks assigned to employee
   */
  getTasksByAssignedTo: (employeeId) => {
    return axios.get(`${API_BASE_URL}/tasks/assigned/${employeeId}`);
  },

  /**
   * Get tasks by status
   */
  getTasksByStatus: (status) => {
    return axios.get(`${API_BASE_URL}/tasks/status/${status}`);
  },

  /**
   * Get tasks by priority
   */
  getTasksByPriority: (priority) => {
    return axios.get(`${API_BASE_URL}/tasks/priority/${priority}`);
  },

  /**
   * Get tasks by project and status
   */
  getTasksByProjectAndStatus: (projectId, status) => {
    return axios.get(`${API_BASE_URL}/tasks/project/${projectId}/status/${status}`);
  },

  /**
   * Get overdue tasks
   */
  getOverdueTasks: () => {
    return axios.get(`${API_BASE_URL}/tasks/overdue`);
  },

  /**
   * Get upcoming tasks
   */
  getUpcomingTasks: (startDate, endDate) => {
    return axios.get(`${API_BASE_URL}/tasks/upcoming`, {
      params: {
        startDate,
        endDate
      }
    });
  },

  /**
   * Update task status
   */
  updateTaskStatus: (id, status) => {
    return axios.patch(`${API_BASE_URL}/tasks/${id}/status/${status}`);
  },

  /**
   * Get task count by status
   */
  getTaskCountByStatus: (projectId, status) => {
    return axios.get(`${API_BASE_URL}/tasks/count/project/${projectId}/status/${status}`);
  }
};

export default taskService;
