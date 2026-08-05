import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import useProjects from '../hooks/useProjects';
import { formatDate } from '../utils/dateUtils';
import { projectStatusLabel } from '../utils/statusUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faEdit, faTrash, faFilter,
  faTimes, faProjectDiagram
} from '@fortawesome/free-solid-svg-icons';
import './ProjectsPage.css';

export default function ProjectsPage() {
  const { user } = useAuth();
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();

  const [filters, setFilters] = useState({ status: '', client: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    status: 'EN_ATTENTE',
    startDate: '',
    endDate: ''
  });

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (filters.status && p.status !== filters.status) return false;
      if (filters.client && !p.client.toLowerCase().includes(filters.client.toLowerCase())) return false;
      return true;
    });
  }, [projects, filters]);

  const openCreate = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      client: '',
      description: '',
      status: 'EN_ATTENTE',
      startDate: '',
      endDate: ''
    });
    setShowModal(true);
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name || '',
      client: project.client || '',
      description: project.description || '',
      status: project.status || 'EN_ATTENTE',
      startDate: project.startDate || '',
      endDate: project.endDate || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null
    };
    if (editingProject) {
      updateProject(editingProject.id, data)
        .then(() => closeModal())
        .catch(() => alert('Erreur lors de la mise à jour.'));
    } else {
      createProject(data)
        .then(() => closeModal())
        .catch(() => alert('Erreur lors de la création.'));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer définitivement ce projet ?')) {
      deleteProject(id).catch(() => alert('Erreur lors de la suppression.'));
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="admin-projects-page">
      <header className="projects-header">
        <h2><FontAwesomeIcon icon={faProjectDiagram} /> Gestion des projets</h2>
        <button className="btn-create" onClick={openCreate}>
          <FontAwesomeIcon icon={faPlus} /> Nouveau projet
        </button>
      </header>

      <div className="filters-bar">
        <div className="filter-group">
          <label><FontAwesomeIcon icon={faFilter} /> Statut</label>
          <select
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          >
            <option value="">Tous les statuts</option>
            <option value="EN_COURS">En cours</option>
            <option value="TERMINE">Terminé</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="ANNULE">Annulé</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Objet</label>
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={filters.client}
            onChange={e => setFilters(f => ({ ...f, client: e.target.value }))}
          />
        </div>
        {(filters.status || filters.client) && (
          <button
            className="btn-clear-filters"
            onClick={() => setFilters({ status: '', client: '' })}
          >
            <FontAwesomeIcon icon={faTimes} /> Effacer
          </button>
        )}
      </div>

      <div className="projects-table-wrapper">
        {filteredProjects.length === 0 ? (
          <p className="no-projects">Aucun projet trouvé.</p>
        ) : (
          <table className="projects-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Client</th>
                <th>Description</th>
                <th>Statut</th>
                <th>Date début</th>
                <th>Date fin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(project => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.client}</td>
                  <td>{project.description}</td>
                  <td>
                    <span className={`badge status-${project.status}`}>
                      {projectStatusLabel(project.status)}
                    </span>
                  </td>
                  <td>{formatDate(project.startDate)}</td>
                  <td>{formatDate(project.endDate)}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-edit"
                      onClick={() => openEdit(project)}
                      title="Modifier"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(project.id)}
                      title="Supprimer"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <button className="close" onClick={closeModal}>&times;</button>
            <h3>{editingProject ? 'Modifier le projet' : 'Nouveau projet'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Objet *</label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Statut</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="EN_COURS">En cours</option>
                    <option value="TERMINE">Terminé</option>
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="ANNULE">Annulé</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date de début</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Date de fin prévue</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingProject ? 'Mettre à jour' : 'Créer'}
                </button>
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
