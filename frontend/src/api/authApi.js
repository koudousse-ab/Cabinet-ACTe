import axios from 'axios';

// Utilise la base de l'API (https://cabinet-acte-backend.onrender.com/api/v1)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const authClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// ═══════ Fonctions d’authentification ═══════
export const login = (email, password) =>
  authClient.post('/auth/login', { email, password }); // axios va appeler /api/v1/auth/login

// ═══════ Utilitaires ═══════
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
