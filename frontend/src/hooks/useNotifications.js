import { useState, useEffect } from 'react';
import notificationApi from '../api/notificationApi';

export default function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    notificationApi.getUnread()
      .then(res => {
        setUnreadCount(res.data);
        setLoading(false);
      })
      .catch(err => {
        // En cas d'erreur (403, 404, etc.), on ne bloque pas l'affichage
        console.warn('Impossible de charger les notifications:', err.message);
        setUnreadCount(0);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { unreadCount, loading, error };
}
