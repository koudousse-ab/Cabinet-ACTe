import { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUserPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import '../enseignants/EnseignantList.css';

export default function EtudiantList({ etudiants, deleteEtudiant, openEdit, onSearch }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!query) {
      setResults(null);
      return;
    }
    const timeout = setTimeout(() => {
      onSearch(query).then(setResults).catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, onSearch]);

  const displayed = useMemo(() => (results !== null ? results : etudiants), [results, etudiants]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Supprimer l'étudiant ${name} ?`)) {
      deleteEtudiant(id);
    }
  };

  return (
    <div className="enseignant-list">
      <div className="enseignant-list-header">
        <h2>Gestion des étudiants</h2>
        <button className="btn-add" onClick={() => openEdit(null)}>
          <FontAwesomeIcon icon={faUserPlus} /> Ajouter
        </button>
      </div>

      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Rechercher un étudiant (nom, email)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="enseignant-table-wrapper">
        <table className="enseignant-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Classe</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((etu) => (
              <tr key={etu.id}>
                <td>{etu.name}</td>
                <td>{etu.email}</td>
                <td>{etu.classe || '—'}</td>
                <td className="actions">
                  <button className="btn-icon" onClick={() => openEdit(etu)} title="Éditer">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="btn-icon danger" onClick={() => handleDelete(etu.id, etu.name)} title="Supprimer">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
            {displayed.length === 0 && (
              <tr><td colSpan={4} className="empty-row">Aucun étudiant trouvé</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
