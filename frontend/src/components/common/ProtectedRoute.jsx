import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/weekly" replace />;
  }

  return children;
}
