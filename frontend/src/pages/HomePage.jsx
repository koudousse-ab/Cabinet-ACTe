import useDashboard from '../hooks/useDashboard';
import StatsCard from '../components/dashboard/StatsCard';
import ProjectStatusChart from '../components/dashboard/ProjectStatusChart';
import TaskStatusChart from '../components/dashboard/TaskStatusChart';
import ProgressChart from '../components/dashboard/ProgressChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import './HomePage.css';

export default function HomePage() {
  const { stats, charts, recentActivity, loading } = useDashboard();

  if (loading || !stats) return <p>Chargement du tableau de bord...</p>;

  return (
    <div className="home-page">
      <div className="stats-grid">
        <StatsCard icon="📁" value={stats.totalProjects} label="Projets au total" />
        <StatsCard icon="🚧" value={stats.inProgressProjects} label="Projets en cours" />
        <StatsCard icon="✅" value={stats.completedProjects} label="Projets terminés" />
        <StatsCard icon="📝" value={stats.totalTasks} label="Tâches au total" />
        <StatsCard icon="⏳" value={stats.tasksInProgress} label="Tâches en cours" />
        <StatsCard icon="🎉" value={stats.tasksCompleted} label="Tâches terminées" />
      </div>

      {charts && (
        <div className="charts-grid">
          <ProjectStatusChart data={charts.projectsByStatus} />
          <TaskStatusChart data={charts.tasksByStatus} />
          <div className="charts-grid-full">
            <ProgressChart data={charts.tasksCompletedPerDay} />
          </div>
        </div>
      )}

      {recentActivity && (
        <RecentActivity
          recentProjects={recentActivity.recentProjects}
          recentTasks={recentActivity.recentTasks}
        />
      )}
    </div>
  );
}
