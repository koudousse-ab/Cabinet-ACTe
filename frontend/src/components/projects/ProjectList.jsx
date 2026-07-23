import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
import { PROJECT_STATUS_OPTIONS, projectStatusLabel } from '../../utils/statusUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './ProjectList.css';

export default function ProjectList({ projects, createProject, updateProject }) {
  const { user } = useAuth();
  const isManager = user?.role === 'ADMIN' || user?.role === 'CHEF_PROJET';
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ status: '', client: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (filters.status && p.status !== filters.status) return false;
      if (filters.client && !p.client.toLowerCase().includes(filters.client.toLowerCase())) return false;
      return true;
    });
  }, [projects, filters]);

  const openCreate = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleSave = (formData) => {
    const promise = editingProject ? updateProject(editingProject.id, formData) : createProject(formData);
    promise
      .then(() => {
        setShowForm(false);
        setEditingProject(null);
      })
      .catch(() => alert("Erreur lors de l'enregistrement du projet"));
  };

  return (
    <div className="project-list-container">
      <div className="project-list-header">
        <h2>Gestion des projets</h2>
        {isManager && (
          <button className="btn-primary" onClick={openCreate}>
            <FontAwesomeIcon icon={faPlus} /> Nouveau projet
          </button>
        )}
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Statut</label>
          <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
            <option value="">Tous les statuts</option>
            {PROJECT_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{projectStatusLabel(s)}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Client</label>
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={filters.client}
            onChange={(e) => setFilters((f) => ({ ...f, client: e.target.value }))}
          />
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={(p) => navigate(`/projects/${p.id}`)} />
          ))}
        </div>
      ) : (
        <div className="no-projects"><p>Aucun projet trouvé</p></div>
      )}

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingProject(null); }}
        />
      )}
    </div>
  );
}
