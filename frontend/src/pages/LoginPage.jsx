import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../api/authApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      {/* Panneau de marque */}
      <aside className="login-brand">
        <div className="login-brand-inner">
          <div className="brand-seal" aria-hidden="true">
            <span>CA</span>
          </div>
          <h1 className="brand-wordmark">Cabinet ACTe</h1>
          <p className="brand-tagline">
            Votre réussite, notre mission. Un outil signé Cabinet ACTe,
            Agence de Conseil en Management et Technologie.
          </p>
        </div>
        <div className="brand-footer">
          <p>Kara-Tomdè, Togo</p>
          <p>+228 92 21 75 64</p>
        </div>
      </aside>

      {/* Panneau de connexion */}
      <main className="login-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <p className="login-eyebrow">Bienvenue</p>
          <h2 className="login-title">Connexion à votre espace</h2>
          <p className="login-subtitle">Entrez vos identifiants pour continuer.</p>

          {error && <div className="login-error" role="alert">{error}</div>}

          <label className="login-field">
            <span className="login-field-label">Email</span>
            <span className="login-input-wrap">
              <FontAwesomeIcon icon={faEnvelope} className="login-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@men.tg"
                required
                autoFocus
                autoComplete="username"
              />
            </span>
          </label>

          <label className="login-field">
            <span className="login-field-label">Mot de passe</span>
            <span className="login-input-wrap">
              <FontAwesomeIcon icon={faLock} className="login-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-toggle-visibility"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </span>
          </label>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? (
              <span className="login-spinner" aria-hidden="true" />
            ) : (
              <>
                Se connecter
                <FontAwesomeIcon icon={faArrowRight} />
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
