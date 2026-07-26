import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import useNotifications from '../../hooks/useNotifications';
import './NotificationDropdown.css';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, refresh } = useNotifications();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      refresh();
    }
  };

  // Formater la date en français
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' à ' + 
           date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <button className="notification-bell" onClick={toggleDropdown}>
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-menu">
          <div className="notification-header">
            <span>Notifications</span>
            <button className="btn-close" onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="no-notifications">Aucune notification</p>
          ) : (
            <>
              <div className="notification-list">
                {notifications.map(notif => (
                  <div key={notif.id} className="notification-item">
                    <div className="notification-message">{notif.message}</div>
                    <div className="notification-footer">
                      <span className="notification-date">{formatDate(notif.createdAt)}</span>
                      <button className="mark-read-btn" onClick={() => markAsRead(notif.id)} title="Marquer comme lu">
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mark-all-read-btn" onClick={markAllAsRead}>
                Tout marquer comme lu
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
