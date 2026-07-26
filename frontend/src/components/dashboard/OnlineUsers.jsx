import usePresence from '../../hooks/usePresence';
import { roleLabel } from '../../utils/statusUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import './OnlineUsers.css';

function formatSecondsAgo(seconds) {
  if (seconds < 30) return "à l'instant";
  if (seconds < 60) return `il y a ${seconds}s`;
  return `il y a ${Math.floor(seconds / 60)} min`;
}

export default function OnlineUsers() {
  const { onlineUsers, loading } = usePresence();

  return (
    <div className="online-users-card">
      <div className="online-users-header">
        <h3>Utilisateurs en ligne</h3>
        <span className="online-count">{onlineUsers.length}</span>
      </div>

      {loading ? (
        <p className="online-empty">Chargement...</p>
      ) : onlineUsers.length === 0 ? (
        <p className="online-empty">Personne d'autre en ligne pour le moment.</p>
      ) : (
        <ul className="online-users-list">
          {onlineUsers.map((u) => (
            <li key={u.email}>
              <span className="online-dot" aria-hidden="true" />
              <FontAwesomeIcon icon={faCircleUser} className="online-avatar" />
              <div className="online-user-info">
                <span className="online-user-name">{u.name}</span>
                <span className="online-user-meta">{roleLabel(u.role)} · {formatSecondsAgo(u.secondsAgo)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
