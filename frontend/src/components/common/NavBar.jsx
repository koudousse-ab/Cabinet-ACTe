import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useNotifications from '../../hooks/useNotifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faProjectDiagram, faTasks, faCalendarAlt,
  faUsers, faFileAlt, faSignOutAlt, faUser,
  faCalendarWeek, faBook, faBell, faListCheck,
  faGraduationCap, faChalkboardTeacher
} from '@fortawesome/free-solid-svg-icons';
import './NavBar.css';

export default function NavBar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isManager = user?.role === 'ADMIN' || user?.role === 'CHEF_PROJET';

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <img src="/logo.png" alt="Logo" className="sidebar-logo" />
        <span className="sidebar-brand-name">MissionFlow</span>
      </div>

      <div className="sidebar-nav">
        {isManager && (
          <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <FontAwesomeIcon icon={faHome} /> <span>Tableau de bord</span>
          </NavLink>
        )}

        {isManager && (
          <>
            <NavLink to="/projects" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <FontAwesomeIcon icon={faProjectDiagram} /> <span>Projets</span>
            </NavLink>
            <NavLink to="/tasks" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <FontAwesomeIcon icon={faTasks} /> <span>Tâches</span>
            </NavLink>
            <NavLink to="/calendar" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <FontAwesomeIcon icon={faCalendarAlt} /> <span>Calendrier</span>
            </NavLink>
            <NavLink to="/employees" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <FontAwesomeIcon icon={faUsers} /> <span>Employés</span>
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <FontAwesomeIcon icon={faFileAlt} /> <span>Rapports</span>
            </NavLink>
            <NavLink to="/courses" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <FontAwesomeIcon icon={faBook} /> <span>Cours</span>
            </NavLink>
          </>
        )}

        {/* Lien programme : 'Mon programme' pour employé, 'Programmes' pour admin */}
        <NavLink to="/weekly" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <FontAwesomeIcon icon={faCalendarWeek} /> <span>{isManager ? 'Programmes' : 'Mon programme'}</span>
        </NavLink>

        {!isManager && (
          <NavLink to="/employee-tasks" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <FontAwesomeIcon icon={faListCheck} /> <span>Mes tâches</span>
          </NavLink>
        )}

        {!isManager && (
          <NavLink to="/employee-courses" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <FontAwesomeIcon icon={faGraduationCap} /> <span>Mes cours</span>
          </NavLink>
        )}

        <NavLink to="/notifications" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <FontAwesomeIcon icon={faBell} /> <span>Notifications</span>
          {unreadCount > 0 && <span className="notif-badge-sidebar">{unreadCount}</span>}
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <FontAwesomeIcon icon={faUser} />
          <span className="user-email">{user?.email}</span>
          <span className="user-role">({user?.role})</span>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
        </button>
      </div>
    </nav>
  );
}
