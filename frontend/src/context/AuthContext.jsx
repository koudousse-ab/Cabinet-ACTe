import { createContext, useState, useContext, useEffect } from 'react';
import { decodeToken } from '../api/authApi';
import apiClient from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        const decoded = decodeToken(token);

        if (decoded?.role === 'ETUDIANT') {
          // Utilisateur étudiant : profil dans la table etudiant
          try {
            const response = await apiClient.get('/etudiants/me');
            const etudiantData = response.data;
            setUser({
              ...decoded,
              id: etudiantData.id,
              name: etudiantData.name,
              email: etudiantData.email,
              classe: etudiantData.classe,
              role: 'ETUDIANT'
            });
          } catch (err) {
            console.error('Erreur chargement utilisateur:', err);
            setUser(decoded);
          }
        } else {
          // Admin / Chef de projet / Enseignant : profil dans la table enseignant
          try {
            const response = await apiClient.get('/enseignants/me');
            const enseignantData = response.data;
            setUser({
              ...decoded,
              id: enseignantData.id,
              name: enseignantData.name,
              email: enseignantData.email,
              role: enseignantData.role
            });
          } catch (err) {
            console.error('Erreur chargement utilisateur:', err);
            setUser(decoded);
          }
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    const decoded = decodeToken(newToken);
    setUser(decoded);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isChefProjet = () => user?.role === 'CHEF_PROJET';
  const isEnseignant = () => user?.role === 'ENSEIGNANT';
  const isEtudiant = () => user?.role === 'ETUDIANT';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAdmin, isChefProjet, isEnseignant, isEtudiant }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
