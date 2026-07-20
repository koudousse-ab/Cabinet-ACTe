import { useState, useEffect, useCallback } from 'react';
import dashboardApi from '../api/dashboardApi';

export default function useDashboard() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(() => {
    setLoading(true);
    return Promise.all([
      dashboardApi.getStats(),
      dashboardApi.getCharts(),
      dashboardApi.getRecentActivity()
    ])
      .then(([statsRes, chartsRes, recentRes]) => {
        setStats(statsRes.data);
        setCharts(chartsRes.data);
        setRecentActivity(recentRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { stats, charts, recentActivity, loading, refresh: fetchAll };
}
