import apiClient from './axiosConfig';

const notificationApi = {
  getUnread: () => apiClient.get('/notifications/unread'),
  getNotifications: () => apiClient.get('/notifications'),
  markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch('/notifications/read-all')
};

export default notificationApi;
