import { useState } from 'react';
import useEnseignants from '../hooks/useEnseignants';
import EnseignantList from '../components/enseignants/EnseignantList';
import EnseignantForm from '../components/enseignants/EnseignantForm';
import './EnseignantsPage.css';

export default function EnseignantsPage() {
  const { enseignants, createEnseignant, updateEnseignant, deleteEnseignant } = useEnseignants();
  const [editingEnseignant, setEditingEnseignant] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const openEdit = (emp) => {
    setEditingEnseignant(emp);
    setShowForm(true);
  };

  const handleSave = (formData) => {
    const promise = editingEnseignant
      ? updateEnseignant(editingEnseignant.id, formData)
      : createEnseignant(formData);
    promise
      .then(() => {
        setShowForm(false);
        setEditingEnseignant(null);
      })
      .catch(() => alert("Erreur lors de l'enregistrement"));
  };

  return (
    <div className="enseignants-page">
      <EnseignantList
        enseignants={enseignants}
        deleteEnseignant={deleteEnseignant}
        openEdit={openEdit}
      />
      {showForm && (
        <EnseignantForm
          enseignant={editingEnseignant}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingEnseignant(null); }}
        />
      )}
    </div>
  );
}
