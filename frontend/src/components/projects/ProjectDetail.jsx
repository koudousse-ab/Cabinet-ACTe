import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import projectApi from '../../api/projectApi';
import ProjectForm from './ProjectForm';
import { formatDate } from '../../utils/dateUtils';
import { PROJECT_STATUS_COLORS, projectStatusLabel, STATUS_COLORS, statusLabel } from '../../utils/statusUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './ProjectDetail.css';

export default function ProjectDetail() {
 const { id } = useParams();
 const navigate = useNavigate();
 const { user } = useAuth();
 const isManager = user?.role === 'ADMIN' || user?.role === 'CHEF_PROJET';
 const [project, setProject] = useState(null);
 const [tasks, setTasks] = useState([]);
 const [showForm, setShowForm] = useState(false);

 const load = () => {
 projectApi.getProjectById(id).then((res) => setProject(res.data));
 projectApi.getProjectTasks(id).then((res) => setTasks(res.data));
 };

 useEffect(() => {
 load();
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
 <button className="btn btn-back" onClick={() => navigate('/projects')}>
 <FontAwesomeIcon icon={faArrowLeft} /> Retour aux projets
 </button>

 <div className="detail-header">
 <div className="detail-top">
 <h2>{project.name}</h2>
 <div className="detail-actions">
 <span className="badge-text" style={{ }}>
 {projectStatusLabel(project.status)}
 </span>
 {isManager && (
 <>
 <button className="btn btn-info" onClick={() => setShowForm(true)}>
 <FontAwesomeIcon icon={faEdit} /> Éditer
 </button>
 <button className="btn btn-danger" onClick={handleDelete}>
 <FontAwesomeIcon icon={faTrash} /> Supprimer
 </button>
 </>
)}
 </div>
 </div>
 <div className="detail-meta">
 <span>Client : {project.client}</span>
 {(project.startDate || project.endDate) && (
 <span>Du {formatDate(project.startDate)} au {formatDate(project.endDate) || '—'}</span>
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
 <span className="badge-text" style={{ }}>
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
