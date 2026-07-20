import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import ReportsPage from './pages/ReportsPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">🚀 Cabinet ACTe - MissionFlow</h1>
            <p className="app-subtitle">Système de gestion de missions et tâches</p>
            <nav className="app-nav">
              <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Tableau de bord</NavLink>
              <NavLink to="/projects" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Projets</NavLink>
              <NavLink to="/tasks" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Tâches</NavLink>
              <NavLink to="/calendar" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Calendrier</NavLink>
              <NavLink to="/employees" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Employés</NavLink>
              <NavLink to="/reports" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Rapports</NavLink>
            </nav>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/:id" element={<EmployeeDetailPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2026 Cabinet ACTe. Tous droits réservés.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
