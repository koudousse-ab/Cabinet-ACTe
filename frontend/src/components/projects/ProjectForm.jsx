import { useState, useEffect } from 'react';
import { PROJECT_STATUS_OPTIONS, projectStatusLabel } from '../../utils/statusUtils';
import '../tasks/TaskForm.css';

const EMPTY_FORM = { name: '', client: '', description: '', status: 'EN_ATTENTE', startDate: '', endDate: '' };

export default function ProjectForm({ project, onSave, onClose }) {
 const [formData, setFormData] = useState(EMPTY_FORM);

 useEffect(() => {
 setFormData(project ? { ...EMPTY_FORM, ...project } : EMPTY_FORM);
 }, [project]);

 const handleChange = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

 const handleSubmit = (e) => {
 e.preventDefault();
 if (!formData.name || !formData.client) {
 alert('Veuillez remplir tous les champs obligatoires');
 return;
 }
 onSave(formData);
 };

 return (
 <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
 <div className="modal-content">
 <button className="close" onClick={onClose}>&times;</button>
 <h3>{project ? 'Éditer le projet' : 'Créer un nouveau projet'}</h3>
 <form onSubmit={handleSubmit}>
 <div className="form-group">
 <label>Nom *</label>
 <input type="text" value={formData.name} onChange={handleChange('name')} required />
 </div>
 <div className="form-group">
 <label>Objet *</label>
 <input type="text" value={formData.client} onChange={handleChange('client')} required />
 </div>
 <div className="form-group">
 <label>Description</label>
 <textarea rows={3} value={formData.description || ''} onChange={handleChange('description')} />
 </div>
 <div className="form-row">
 <div className="form-group">
 <label>Statut *</label>
 <select value={formData.status} onChange={handleChange('status')} required>
 {PROJECT_STATUS_OPTIONS.map((s) => (
 <option key={s} value={s}>{projectStatusLabel(s)}</option>
))}
 </select>
 </div>
 </div>
 <div className="form-row">
 <div className="form-group">
 <label>Date de début</label>
 <input type="date" value={formData.startDate || ''} onChange={handleChange('startDate')} />
 </div>
 <div className="form-group">
 <label>Date de fin prévue</label>
 <input type="date" value={formData.endDate || ''} onChange={handleChange('endDate')} />
 </div>
 </div>
 <div className="form-actions">
 <button type="submit" className="btn btn-primary">Enregistrer</button>
 <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
 </div>
 </form>
 </div>
 </div>
);
}
