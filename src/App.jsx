import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import NavBar from './components/common/NavBar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import ReportsPage from './pages/ReportsPage';
import WeeklyProgram from './pages/WeeklyProgram';
import NotificationsPage from './pages/NotificationsPage';
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
        <p>&copy; 2026 Cabinet ACTe. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="employees/:id" element={<EmployeeDetailPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="weekly" element={<WeeklyProgram />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
