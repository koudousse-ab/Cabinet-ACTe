import axios from 'axios';

// ═══════ Instance dédiée à l'authentification (sans /api/v1) ═══════
// Dérivée de la même variable d'environnement que le reste de l'app pour
// fonctionner aussi bien en local qu'une fois déployé (ex: Render).
const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/api\/v1\/?$/, '');
const authClient = axios.create({
  baseURL: API_ROOT,
  headers: { 'Content-Type': 'application/json' }
});

// ═══════ Fonctions d’authentification ═══════
export const login = (email, password) =>
  authClient.post('/api/auth/login', { email, password });

// ═══════ Utilitaires (inchangés) ═══════
export const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.role?.replace('ROLE_', '') || null;
    return { email: payload.sub, role };
  } catch {
    return null;
  }
};

export const hasRole = (user, allowedRoles) => {
  if (!user || !user.role) return false;
  return allowedRoles.includes(user.role);
};