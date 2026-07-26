import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useNotifications from '../../hooks/useNotifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faProjectDiagram, faTasks, faCalendarAlt,
  faUsers, faFileAlt, faSignOutAlt, faUser,
  faCalendarWeek, faBook, faBell, faListCheck,
  faGraduationCap, faChalkboardTeacher, faUserGraduate,
  faBars, faXmark
} from '@fortawesome/free-solid-svg-icons';
import './NavBar.css';

export default function NavBar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Ferme le tiroir mobile à chaque changement de page
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isManager = user?.role === 'ADMIN' || user?.role === 'CHEF_PROJET';
  const isAdmin = user?.role === 'ADMIN';
  const isEnseignant = user?.role === 'ENSEIGNANT';
  const isEtudiant = user?.role === 'ETUDIANT';

  return (
    <>
      {/* Barre supérieure mobile : logo + bouton menu */}
      <div className="mobile-topbar">
        <button className="mobile-menu-btn" onClick={() => setIsOpen(true)} aria-label="Ouvrir le menu">
          <FontAwesomeIcon icon={faBars} />
        </button>
        <img src="/logo.png" alt="Logo" className="mobile-topbar-logo" />
        <span className="mobile-topbar-name">MissionFlow</span>
        <NavLink to="/notifications" className="mobile-topbar-bell">
          <FontAwesomeIcon icon={faBell} />
          {unreadCount > 0 && <span className="notif-badge-sidebar">{unreadCount}</span>}
        </NavLink>
      </div>

      {/* Fond assombri derrière le tiroir sur mobile */}
      {isOpen && <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />}

      <nav className={`sidebar${isOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <img src="/logo.png" alt="Logo" className="sidebar-logo" />
          <span className="sidebar-brand-name">MissionFlow</span>
          <button className="sidebar-close-btn" onClick={() => setIsOpen(false)} aria-label="Fermer le menu">
            <FontAwesomeIcon icon={faXmark} />
          </button>
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
              <NavLink to="/enseignants" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
                <FontAwesomeIcon icon={faChalkboardTeacher} /> <span>Enseignants</span>
              </NavLink>
              {isAdmin && (
                <NavLink to="/etudiants" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
                  <FontAwesomeIcon icon={faUserGraduate} /> <span>Étudiants</span>
                </NavLink>
              )}
              <NavLink to="/reports" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
                <FontAwesomeIcon icon={faFileAlt} /> <span>Rapports</span>
              </NavLink>
              <NavLink to="/courses" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
                <FontAwesomeIcon icon={faBook} /> <span>Cours</span>
              </NavLink>
            </>
          )}

          {/* Lien programme : 'Mon programme' pour enseignant/étudiant, 'Programmes' pour admin/chef de projet */}
          <NavLink to="/weekly" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <FontAwesomeIcon icon={faCalendarWeek} /> <span>{isManager ? 'Programmes' : 'Mon programme'}</span>
          </NavLink>

          {isEnseignant && (
            <NavLink to="/enseignant-tasks" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <FontAwesomeIcon icon={faListCheck} /> <span>Mes tâches</span>
            </NavLink>
          )}

          {isEnseignant && (
            <NavLink to="/enseignant-courses" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <FontAwesomeIcon icon={faGraduationCap} /> <span>Mes cours</span>
            </NavLink>
          )}

          {isEtudiant && (
            <NavLink to="/mon-agenda" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <FontAwesomeIcon icon={faGraduationCap} /> <span>Mon agenda</span>
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
    </>
  );
}
