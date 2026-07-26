import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, statusLabel, priorityLabel } from '../../utils/statusUtils';
import './TaskForm.css';

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  projectId: '',
  assignedTo: '',
  dueDate: '',
  scheduledTime: '',
  estimatedHours: '',
  actualHours: ''
};

export default function TaskForm({ task, projects, enseignants, defaultDueDate, onSave, onClose }) {
  const { user } = useAuth();
  const isManager = user?.role === 'ADMIN' || user?.role === 'CHEF_PROJET';
  const isAssignedToMe = task && task.assignedTo === user?.id;
  const canEditStatus = !isManager && isAssignedToMe;
  const canEditAll = isManager;

  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (task) {
      setFormData({ ...EMPTY_FORM, ...task });
    } else {
      setFormData({ ...EMPTY_FORM, dueDate: defaultDueDate || '' });
    }
  }, [task, defaultDueDate]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Le titre est obligatoire');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <button className="close" onClick={onClose}>&times;</button>
        <h3>{task ? 'Éditer la tâche' : 'Créer une nouvelle tâche'}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Titre *</label>
            <input id="title" type="text" value={formData.title} onChange={handleChange('title')} required disabled={!canEditAll} />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" rows={3} value={formData.description || ''} onChange={handleChange('description')} disabled={!canEditAll} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Statut *</label>
              <select id="status" value={formData.status} onChange={handleChange('status')} required disabled={!(canEditAll || canEditStatus)}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{statusLabel(s)}</option>
                ))}
              </select>
              {canEditStatus && <small style={{ color: '#0066cc' }}>Vous ne pouvez modifier que le statut</small>}
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priorité *</label>
              <select id="priority" value={formData.priority} onChange={handleChange('priority')} required disabled={!canEditAll}>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{priorityLabel(p)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="projectId">Projet (optionnel)</label>
              <select id="projectId" value={formData.projectId} onChange={handleChange('projectId')} disabled={!canEditAll}>
                <option value="">Aucun projet</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="assignedTo">Assigné à</label>
              <select id="assignedTo" value={formData.assignedTo || ''} onChange={handleChange('assignedTo')} disabled={!canEditAll}>
                <option value="">Non assigné</option>
                {enseignants.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">Date limite</label>
              <input id="dueDate" type="date" value={formData.dueDate || ''} onChange={handleChange('dueDate')} disabled={!canEditAll} />
            </div>
            <div className="form-group">
              <label htmlFor="scheduledTime">Heure prévue</label>
              <input id="scheduledTime" type="time" value={formData.scheduledTime || ''} onChange={handleChange('scheduledTime')} disabled={!canEditAll} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="estimatedHours">Heures estimées</label>
            <input id="estimatedHours" type="number" step="0.5" value={formData.estimatedHours || ''} onChange={handleChange('estimatedHours')} disabled={!canEditAll} />
          </div>
          <div className="form-actions">
            {(canEditAll || canEditStatus) && (
              <button type="submit" className="btn btn-primary">
                {canEditStatus ? 'Mettre à jour le statut' : 'Enregistrer'}
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}
