import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../enseignants/EnseignantForm.css';

const EMPTY_FORM = {
  name: '',
  email: '',
  classe: '',
  password: ''
};

export default function EtudiantForm({ etudiant, onSave, onClose }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const isEditing = !!etudiant;

  useEffect(() => {
    if (etudiant) {
      setFormData({ ...EMPTY_FORM, ...etudiant, password: '' });
    } else {
      setFormData({ ...EMPTY_FORM });
    }
  }, [etudiant]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditing && !formData.password) {
      alert('Le mot de passe est obligatoire pour un nouvel étudiant');
      return;
    }
    if (!formData.name || !formData.email) {
      alert("Le nom et l'email sont obligatoires");
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
        <h3>{isEditing ? 'Éditer un étudiant' : 'Ajouter un étudiant'}</h3>

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
            <label>Classe</label>
            <input type="text" value={formData.classe} onChange={handleChange('classe')} placeholder="Ex: L3 Informatique" />
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
