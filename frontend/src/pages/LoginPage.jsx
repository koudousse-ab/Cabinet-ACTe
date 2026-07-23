import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../api/authApi';
import './LoginPage.css';

export default function LoginPage() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
 const { login } = useAuth();
 const navigate = useNavigate();

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError('');
 setLoading(true);

 try {
 const response = await apiLogin(email, password);
 const token = response.data.token;
 login(token);
 navigate('/');
 } catch (err) {
 setError('Email ou mot de passe incorrect');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="login-container">
 <div className="login-card">
 <h2>MissionFlow</h2>
 <p>Connexion au tableau de bord</p>
 {error && <div className="login-error">{error}</div>}
 <form onSubmit={handleSubmit}>
 <div className="form-group">
 <label>Email</label>
 <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
 </div>
 <div className="form-group">
 <label>Mot de passe</label>
 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
 </div>
 <button type="submit" disabled={loading}>
 {loading ? 'Connexion...' : 'Se connecter'}
 </button>
 </form>
 <p className="login-hint">admin@cabinet-acte.com / admin123</p>
 </div>
 </div>
);
}
