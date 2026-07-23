import useDashboard from '../hooks/useDashboard';
import StatsCard from '../components/dashboard/StatsCard';
import ProjectStatusChart from '../components/dashboard/ProjectStatusChart';
import TaskStatusChart from '../components/dashboard/TaskStatusChart';
import ProgressChart from '../components/dashboard/ProgressChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

export default function HomePage() {
  const { user } = useAuth();
  const { stats, charts, recentActivity, loading, error } = useDashboard();

  if (loading) return <div className="dashboard-loading">Chargement...</div>;
  if (error) return <div className="dashboard-error">Erreur : {error.message}</div>;
  if (!stats || !charts || !recentActivity) {
    return <div className="dashboard-empty">Aucune donnée disponible</div>;
  }

  const displayName = user?.name || user?.email || 'Utilisateur';

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Bonjour, {displayName}</h1>
          <p className="dashboard-subtitle">Résumé de vos activités et statistiques</p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </div>
      </header>

      <div className="stats-grid">
        <StatsCard value={stats.totalProjects} label="Projets au total" color="#4e73df" />
        <StatsCard value={stats.inProgressProjects} label="Projets en cours" color="#e67e22" />
        <StatsCard value={stats.completedProjects} label="Projets terminés" color="#1cc88a" />
        <StatsCard value={stats.totalTasks} label="Tâches au total" color="#36b9cc" />
        <StatsCard value={stats.tasksInProgress} label="Tâches en cours" color="#e67e22" />
        <StatsCard value={stats.tasksCompleted} label="Tâches terminées" color="#1cc88a" />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <ProjectStatusChart data={charts.projectsByStatus} />
        </div>
        <div className="chart-card">
          <TaskStatusChart data={charts.tasksByStatus} />
        </div>
        <div className="chart-card full-width">
          <ProgressChart data={charts.tasksCompletedPerDay} />
        </div>
      </div>

      <div className="recent-section">
        <RecentActivity
          recentProjects={recentActivity.recentProjects}
          recentTasks={recentActivity.recentTasks}
        />
      </div>
    </div>
  );
}
