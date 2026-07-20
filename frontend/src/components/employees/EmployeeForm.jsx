import { useState, useEffect } from 'react';
import { ROLE_OPTIONS, roleLabel } from '../../utils/statusUtils';
import '../tasks/TaskForm.css';

const EMPTY_FORM = { name: '', email: '', role: 'EMPLOYE' };

export default function EmployeeForm({ employee, onSave, onClose }) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    setFormData(employee ? { ...EMPTY_FORM, ...employee } : EMPTY_FORM);
  }, [employee]);

  const handleChange = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <button className="close" onClick={onClose}>&times;</button>
        <h3>{employee ? "Éditer l'employé" : 'Ajouter un employé'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom *</label>
            <input type="text" value={formData.name} onChange={handleChange('name')} required />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input type="email" value={formData.email} onChange={handleChange('email')} required />
          </div>
          <div className="form-group">
            <label>Rôle *</label>
            <select value={formData.role} onChange={handleChange('role')} required>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{roleLabel(r)}</option>
              ))}
            </select>
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
