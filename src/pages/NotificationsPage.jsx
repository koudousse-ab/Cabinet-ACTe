import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import './NotificationsPage.css';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Erreur marquage lu:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Erreur tout marquer lu:', error);
    }
  };

  if (loading) return <div className="notif-loading">Chargement...</div>;

  return (
    <div className="notifications-page">
      <header className="notif-header">
        <h2><FontAwesomeIcon icon={faBell} /> Historique des notifications</h2>
        <button className="btn-read-all" onClick={markAllAsRead}>
          <FontAwesomeIcon icon={faCheckCircle} /> Tout marquer comme lu
        </button>
      </header>

      {notifications.length === 0 ? (
        <p className="no-notif">Aucune notification pour le moment.</p>
      ) : (
        <ul className="notif-list">
          {notifications.map(notif => (
            <li key={notif.id} className={`notif-item${notif.read ? ' read' : ' unread'}`}>
              <div className="notif-content">
                <p>{notif.message}</p>
                <span className="notif-date">
                  {new Date(notif.createdAt).toLocaleString('fr-FR')}
                </span>
              </div>
              {!notif.read && (
                <button className="btn-mark-read" onClick={() => markAsRead(notif.id)}>
                  <FontAwesomeIcon icon={faCheckCircle} /> Marquer lu
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
