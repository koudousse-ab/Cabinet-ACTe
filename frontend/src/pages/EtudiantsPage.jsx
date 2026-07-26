import { useState } from 'react';
import useEtudiants from '../hooks/useEtudiants';
import EtudiantList from '../components/etudiants/EtudiantList';
import EtudiantForm from '../components/etudiants/EtudiantForm';
import './EnseignantsPage.css';

export default function EtudiantsPage() {
  const { etudiants, createEtudiant, updateEtudiant, deleteEtudiant, searchEtudiants } = useEtudiants();
  const [editingEtudiant, setEditingEtudiant] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const openEdit = (etu) => {
    setEditingEtudiant(etu);
    setShowForm(true);
  };

  const handleSave = (formData) => {
    const promise = editingEtudiant
      ? updateEtudiant(editingEtudiant.id, formData)
      : createEtudiant(formData);
    promise
      .then(() => {
        setShowForm(false);
        setEditingEtudiant(null);
      })
      .catch(() => alert("Erreur lors de l'enregistrement"));
  };

  return (
    <div className="enseignants-page">
      <EtudiantList
        etudiants={etudiants}
        deleteEtudiant={deleteEtudiant}
        openEdit={openEdit}
        onSearch={searchEtudiants}
      />
      {showForm && (
        <EtudiantForm
          etudiant={editingEtudiant}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingEtudiant(null); }}
        />
      )}
    </div>
  );
}
