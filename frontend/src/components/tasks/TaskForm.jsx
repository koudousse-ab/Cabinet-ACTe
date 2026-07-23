import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, statusLabel, priorityLabel } from '../../utils/statusUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './TaskForm.css';

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  projectId: '',
  assignedTo: '',
  dueDate: '',
  estimatedHours: '',
  actualHours: ''
};

export default function TaskForm({ task, projects, employees, defaultDueDate, onSave, onClose }) {
  const { user } = useAuth();
  const isManager = user?.role === 'ADMIN' || user?.role === 'CHEF_PROJET';
  const isAssignedToMe = task && task.assignedTo === user?.id;

  // L'employé ne peut modifier que le statut
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
        <button className="close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h3>{task ? 'Éditer la tâche' : 'Créer une nouvelle tâche'}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre *</label>
            <input type="text" value={formData.title} onChange={handleChange('title')} required disabled={!canEditAll} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea rows={3} value={formData.description || ''} onChange={handleChange('description')} disabled={!canEditAll} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Statut *</label>
              <select value={formData.status} onChange={handleChange('status')} required disabled={!(canEditAll || canEditStatus)}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{statusLabel(s)}</option>
                ))}
              </select>
              {canEditStatus && <small className="hint">Vous ne pouvez modifier que le statut</small>}
            </div>
            <div className="form-group">
              <label>Priorité *</label>
              <select value={formData.priority} onChange={handleChange('priority')} required disabled={!canEditAll}>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{priorityLabel(p)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Projet (optionnel)</label>
              <select value={formData.projectId} onChange={handleChange('projectId')} disabled={!canEditAll}>
                <option value="">Aucun projet</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Assigné à</label>
              <select value={formData.assignedTo || ''} onChange={handleChange('assignedTo')} disabled={!canEditAll}>
                <option value="">Non assigné</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date limite</label>
              <input type="date" value={formData.dueDate || ''} onChange={handleChange('dueDate')} disabled={!canEditAll} />
            </div>
            <div className="form-group">
              <label>Heures estimées</label>
              <input type="number" step="0.5" value={formData.estimatedHours || ''} onChange={handleChange('estimatedHours')} disabled={!canEditAll} />
            </div>
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
