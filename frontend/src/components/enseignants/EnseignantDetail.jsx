import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import enseignantApi from '../../api/enseignantApi';
import EnseignantForm from './EnseignantForm';
import EnseignantStats from './EnseignantStats';
import ErrorCounter from './ErrorCounter';
import { STATUS_COLORS, statusLabel, ROLE_COLORS, roleLabel } from '../../utils/statusUtils';
import './EnseignantDetail.css';

export default function EnseignantDetail() {
 const { id } = useParams();
 const navigate = useNavigate();
 const [enseignant, setEnseignant] = useState(null);
 const [tasks, setTasks] = useState([]);
 const [errors, setErrors] = useState([]);
 const [showForm, setShowForm] = useState(false);

 const load = useCallback(() => {
 enseignantApi.getEnseignantById(id).then((res) => setEnseignant(res.data));
 enseignantApi.getEnseignantTasks(id).then((res) => setTasks(res.data));
 enseignantApi.getEnseignantErrors(id).then((res) => setErrors(res.data));
 }, [id]);

 useEffect(() => {
 load();
 }, [load]);

 const handleDelete = () => {
 if (window.confirm('Supprimer cet enseignant ?')) {
 enseignantApi.deleteEnseignant(id).then(() => navigate('/enseignants'));
 }
 };

 const handleSave = (formData) => {
 enseignantApi.updateEnseignant(id, formData).then(() => {
 setShowForm(false);
 load();
 });
 };

 if (!enseignant) return <p>Chargement...</p>;

 return (
 <div className="enseignant-detail">
 <button className="btn btn-back" onClick={() => navigate('/enseignants')}>← Retour aux enseignants</button>

 <div className="detail-header">
 <div className="detail-top">
 <h2>{enseignant.name}</h2>
 <div className="detail-actions">
 <span className="badge-text" style={{ backgroundColor: ROLE_COLORS[enseignant.role] }}>
 {roleLabel(enseignant.role)}
 </span>
 <button className="btn btn-info" onClick={() => setShowForm(true)}> Éditer</button>
 <button className="btn btn-danger" onClick={handleDelete}> Supprimer</button>
 </div>
 </div>
 <p className="detail-meta"><FontAwesomeIcon icon={faEnvelope} /> {enseignant.email}</p>
 </div>

 <div className="detail-section">
 <h3>Activité de la semaine</h3>
 <EnseignantStats tasks={tasks} />
 </div>

 <div className="two-columns">
 <div className="detail-section">
 <h3>Tâches assignées ({tasks.length})</h3>
 {tasks.length === 0 ? (
 <p>Aucune tâche assignée.</p>
) : (
 tasks.map((task) => (
 <div key={task.id} className="task-row" onClick={() => navigate(`/tasks?edit=${task.id}`)}>
 <span className="task-row-title">{task.title}</span>
 <span className="badge-text" style={{ backgroundColor: STATUS_COLORS[task.status] }}>
 {statusLabel(task.status)}
 </span>
 </div>
))
)}
 </div>

 <ErrorCounter enseignantId={Number(id)} errors={errors} onErrorAdded={load} />
 </div>

 {showForm && (
 <EnseignantForm enseignant={enseignant} onSave={handleSave} onClose={() => setShowForm(false)} />
)}
 </div>
);
}
