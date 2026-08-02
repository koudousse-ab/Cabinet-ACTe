import EnseignantCoursesPage from "./pages/EnseignantCoursesPage";
import EnseignantTasksPage from "./pages/EnseignantTasksPage";
import CoursesPage from "./pages/CoursesPage";
import NotificationsPage from "./pages/NotificationsPage";
import EtudiantsPage from "./pages/EtudiantsPage";
import MonAgendaPage from "./pages/MonAgendaPage";
import MesCoursEtudiantPage from "./pages/MesCoursEtudiantPage";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import NavBar from './components/common/NavBar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import EnseignantsPage from './pages/EnseignantsPage';
import EnseignantDetailPage from './pages/EnseignantDetailPage';
import ReportsPage from './pages/ReportsPage';
import WeeklyProgram from './pages/WeeklyProgram';
import './App.css';

function AppLayout() {
  return (
    <div className="app-container">
      <NavBar />
      <div className="app-main-wrapper">
        <main className="app-main">
          <Outlet />
        </main>
      </div>
      <footer className="app-footer">
        <p>&copy; 2026 ACTe. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'CHEF_PROJET']}>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<HomePage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:id" element={<ProjectDetailPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="enseignants" element={<EnseignantsPage />} />
              <Route path="enseignants/:id" element={<EnseignantDetailPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="courses" element={<CoursesPage />} />
            </Route>

            <Route path="/" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="etudiants" element={<EtudiantsPage />} />
            </Route>

            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="weekly" element={<WeeklyProgram />} />
              <Route path="enseignant-tasks" element={<EnseignantTasksPage />} />
              <Route path="enseignant-courses" element={<EnseignantCoursesPage />} />
              <Route path="mon-agenda" element={<MonAgendaPage />} />
              <Route path="mes-cours" element={<MesCoursEtudiantPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>

            <Route path="/" element={<Navigate to="/weekly" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
