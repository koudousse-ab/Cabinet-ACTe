import { useState, useEffect } from 'react';
import presenceApi from '../api/presenceApi';

export default function usePresence(pollIntervalMs = 20000) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchOnline = () => {
      presenceApi.getOnlineUsers()
        .then((res) => {
          if (!cancelled) setOnlineUsers(res.data);
        })
        .catch(() => {
          if (!cancelled) setOnlineUsers([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };

    fetchOnline();
    const interval = setInterval(fetchOnline, pollIntervalMs);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [pollIntervalMs]);

  return { onlineUsers, loading };
}
