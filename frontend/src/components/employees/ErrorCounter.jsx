import { useState } from 'react';
import { formatDate } from '../../utils/dateUtils';
import employeeApi from '../../api/employeeApi';
import './EmployeeStats.css';

export default function ErrorCounter({ employeeId, errors, onErrorAdded }) {
 const [description, setDescription] = useState('');
 const [submitting, setSubmitting] = useState(false);

 const handleAdd = (e) => {
 e.preventDefault();
 if (!description.trim()) return;

 setSubmitting(true);
 employeeApi
 .addError({ employeeId, description: description.trim(), date: new Date().toISOString().slice(0, 10) })
 .then(() => {
 setDescription('');
 onErrorAdded();
 })
 .catch(() => alert("Erreur lors de l'ajout de l'erreur"))
 .finally(() => setSubmitting(false));
 };

 return (
 <div className="error-counter">
 <div className="error-counter-header">
 <h3>Compteur d'erreurs</h3>
 <span className="error-count-badge">{errors.length}</span>
 </div>

 {errors.length === 0 ? (
 <p className="no-errors">Aucune erreur enregistrée</p>
) : (
 errors
 .slice()
 .sort((a, b) => new Date(b.date) - new Date(a.date))
 .map((err) => (
 <div key={err.id} className="error-item">
 <span>{err.description}</span>
 <span className="error-date">{formatDate(err.date)}</span>
 </div>
))
)}

 <form className="add-error-form" onSubmit={handleAdd}>
 <input
 type="text"
 placeholder="Décrire une nouvelle erreur..."
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 />
 <button type="submit" disabled={submitting}>+ Ajouter</button>
 </form>
 </div>
);
}
