import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import projectApi from '../../api/projectApi';
import ProjectForm from './ProjectForm';
import { formatDate } from '../../utils/dateUtils';
import { PROJECT_STATUS_COLORS, projectStatusLabel, STATUS_COLORS, statusLabel } from '../../utils/statusUtils';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    projectApi.getProjectById(id).then((res) => setProject(res.data));
    projectApi.getProjectTasks(id).then((res) => setTasks(res.data));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('Supprimer ce projet ?')) {
      projectApi.deleteProject(id).then(() => navigate('/projects'));
    }
  };

  const handleSave = (formData) => {
    projectApi.updateProject(id, formData).then(() => {
      setShowForm(false);
      load();
    });
  };

  if (!project) return <p>Chargement...</p>;

  return (
    <div className="project-detail">
      <button className="btn btn-back" onClick={() => navigate('/projects')}>← Retour aux projets</button>

      <div className="detail-header">
        <div className="detail-top">
          <h2>{project.name}</h2>
          <div className="detail-actions">
            <span className="badge" style={{ backgroundColor: PROJECT_STATUS_COLORS[project.status] }}>
              {projectStatusLabel(project.status)}
            </span>
            <button className="btn btn-info" onClick={() => setShowForm(true)}>✏️ Éditer</button>
            <button className="btn btn-danger" onClick={handleDelete}>🗑️ Supprimer</button>
          </div>
        </div>
        <div className="detail-meta">
          <span>👤 Client : {project.client}</span>
          {(project.startDate || project.endDate) && (
            <span>📅 {formatDate(project.startDate)} → {formatDate(project.endDate) || '—'}</span>
          )}
        </div>
        {project.description && <p className="detail-description">{project.description}</p>}
      </div>

      <div className="tasks-section">
        <h3>Tâches du projet ({tasks.length})</h3>
        {tasks.length === 0 ? (
          <p>Aucune tâche associée à ce projet.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-row" onClick={() => navigate(`/tasks?edit=${task.id}`)}>
              <span className="task-row-title">{task.title}</span>
              <span className="badge" style={{ backgroundColor: STATUS_COLORS[task.status] }}>
                {statusLabel(task.status)}
              </span>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <ProjectForm project={project} onSave={handleSave} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
