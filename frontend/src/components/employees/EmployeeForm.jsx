import { useState, useEffect } from 'react';
import { ROLE_OPTIONS, roleLabel } from '../../utils/statusUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './EmployeeForm.css';

const EMPTY_FORM = {
 name: '',
 email: '',
 role: 'EMPLOYE',
 password: ''
};

export default function EmployeeForm({ employee, onSave, onClose }) {
 const [formData, setFormData] = useState(EMPTY_FORM);
 const isEditing = !!employee;

 useEffect(() => {
 if (employee) {
 setFormData({ ...EMPTY_FORM, ...employee, password: '' });
 } else {
 setFormData({ ...EMPTY_FORM });
 }
 }, [employee]);

 const handleChange = (field) => (e) => {
 setFormData((prev) => ({ ...prev, [field]: e.target.value }));
 };

 const handleSubmit = (e) => {
 e.preventDefault();
 if (!isEditing && !formData.password) {
 alert('Le mot de passe est obligatoire pour un nouvel employé');
 return;
 }
 if (!formData.name || !formData.email) {
 alert('Le nom et l\'email sont obligatoires');
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
 <h3>{isEditing ? 'Éditer un employé' : 'Ajouter un employé'}</h3>

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
 {ROLE_OPTIONS.map((role) => (
 <option key={role} value={role}>{roleLabel(role)}</option>
))}
 </select>
 </div>
 <div className="form-group">
 <label>Mot de passe {!isEditing && '*'}</label>
 <input
 type="password"
 value={formData.password}
 onChange={handleChange('password')}
 required={!isEditing}
 placeholder={isEditing ? 'Laisser vide pour ne pas modifier' : ''}
 />
 {isEditing && <small>Laissez vide pour conserver le mot de passe actuel.</small>}
 </div>
 <div className="form-actions">
 <button type="submit" className="btn btn-primary">
 {isEditing ? 'Mettre à jour' : 'Créer'}
 </button>
 <button type="button" className="btn btn-secondary" onClick={onClose}>
 Annuler
 </button>
 </div>
 </form>
 </div>
 </div>
);
}
