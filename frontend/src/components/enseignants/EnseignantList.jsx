import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS, roleLabel } from '../../utils/statusUtils';
import enseignantApi from '../../api/enseignantApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye, faUserPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import './EnseignantList.css';

export default function EnseignantList({ enseignants, deleteEnseignant, openEdit }) {   // ← openEdit récupéré des props
  const { user } = useAuth();
  const navigate = useNavigate();
  const isManager = user?.role === 'ADMIN' || user?.role === 'CHEF_PROJET';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!query || !isManager) {
      setResults(null);
      return;
    }
    const timeout = setTimeout(() => {
      enseignantApi.searchEnseignants(query)
        .then((res) => setResults(res.data))
        .catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, isManager]);

  const displayed = useMemo(() => (results !== null ? results : enseignants), [results, enseignants]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Supprimer l'enseignant ${name} ?`)) {
      deleteEnseignant(id);
    }
  };

  return (
    <div className="enseignant-list">
      <div className="enseignant-list-header">
        <h2>Gestion des enseignants</h2>
        {isManager && (
          <button className="btn-add" onClick={() => openEdit(null)}>
            <FontAwesomeIcon icon={faUserPlus} /> Ajouter
          </button>
        )}
      </div>

      {isManager && (
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="Rechercher un enseignant (nom, email)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      <div className="enseignant-table-wrapper">
        <table className="enseignant-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>
                  <span className="role-badge role-text">{roleLabel(emp.role)}</span>
                </td>
                <td className="actions">
                  <button className="btn-icon" onClick={() => navigate(`/enseignants/${emp.id}`)} title="Voir">
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  {isManager && (
                    <>
                      <button className="btn-icon" onClick={() => openEdit(emp)} title="Éditer">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="btn-icon danger" onClick={() => handleDelete(emp.id, emp.name)} title="Supprimer">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}