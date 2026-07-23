import { useState, useEffect } from 'react';
import dashboardApi from '../api/dashboardApi';

export default function useDashboard() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      dashboardApi.getStats(),
      dashboardApi.getCharts(),
      dashboardApi.getRecent()
    ])
    .then(([statsRes, chartsRes, recentRes]) => {
      setStats(statsRes.data);
      setCharts(chartsRes.data);
      setRecentActivity(recentRes.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Erreur chargement dashboard:', err);
      setError(err);
      setLoading(false);
    });
  }, []);

  return { stats, charts, recentActivity, loading, error };
}
