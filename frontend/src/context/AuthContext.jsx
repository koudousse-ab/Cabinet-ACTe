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
        console.log('🔍 Decoded token:', decoded);
        try {
          const response = await apiClient.get('/employees/me');
          const employeeData = response.data;
          console.log('🔍 Données employé depuis /me:', employeeData);
          setUser({
            ...decoded,
            id: employeeData.id,
            name: employeeData.name,
            email: employeeData.email,
            role: employeeData.role
          });
        } catch (err) {
          console.error('Erreur chargement utilisateur:', err);
          setUser(decoded);
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

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
