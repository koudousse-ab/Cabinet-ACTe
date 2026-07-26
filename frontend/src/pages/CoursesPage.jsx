import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import useCourses from '../hooks/useCourses';
import useEnseignants from '../hooks/useEnseignants';
import SearchableSelect from '../components/common/SearchableSelect';
import { formatDate } from '../utils/dateUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faEdit, faTrash, faFilter,
  faTimes, faBook
} from '@fortawesome/free-solid-svg-icons';
import './CoursesPage.css';

export default function CoursesPage() {
  const { user } = useAuth();
  const { courses, loading, createCourse, updateCourse, deleteCourse } = useCourses();
  const { enseignants } = useEnseignants();

  const [filters, setFilters] = useState({ status: '', assignedTo: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    assignedTo: '',
    status: 'PLANNED'
  });

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      if (filters.status && c.status !== filters.status) return false;
      if (filters.assignedTo && String(c.assignedTo) !== filters.assignedTo) return false;
      return true;
    });
  }, [courses, filters]);

  const openCreate = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      assignedTo: '',
      status: 'PLANNED'
    });
    setShowModal(true);
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      startDate: course.startDate || '',
      endDate: course.endDate || '',
      startTime: course.startTime || '',
      assignedTo: String(course.assignedTo || ''),
      status: course.status || 'PLANNED'
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      assignedTo: formData.assignedTo ? Number(formData.assignedTo) : null,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      startTime: formData.startTime || null
    };
    if (editingCourse) {
      updateCourse(editingCourse.id, data)
        .then(() => closeModal())
        .catch(() => alert('Erreur lors de la mise à jour.'));
    } else {
      createCourse(data)
        .then(() => closeModal())
        .catch(() => alert('Erreur lors de la création.'));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer définitivement ce cours ?')) {
      deleteCourse(id).catch(() => alert('Erreur lors de la suppression.'));
    }
  };

  const getEnseignantName = (id) => {
    const emp = enseignants.find(e => e.id === id);
    return emp ? emp.name : 'Non assigné';
  };

  const statusLabel = (status) => {
    const map = {
      PLANNED: 'Planifié',
      IN_PROGRESS: 'En cours',
      COMPLETED: 'Terminé',
      CANCELLED: 'Annulé'
    };
    return map[status] || status;
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="admin-courses-page">
      <header className="courses-header">
        <h2><FontAwesomeIcon icon={faBook} /> Gestion des cours</h2>
        <button className="btn-create" onClick={openCreate}>
          <FontAwesomeIcon icon={faPlus} /> Nouveau cours
        </button>
      </header>

      <div className="filters-bar">
        <div className="filter-group">
          <label><FontAwesomeIcon icon={faFilter} /> Statut</label>
          <select
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          >
            <option value="">Tous les statuts</option>
            <option value="PLANNED">Planifié</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="COMPLETED">Terminé</option>
            <option value="CANCELLED">Annulé</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Assigné à</label>
          <select
            value={filters.assignedTo}
            onChange={e => setFilters(f => ({ ...f, assignedTo: e.target.value }))}
          >
            <option value="">Tous les enseignants</option>
            {enseignants.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
        {(filters.status || filters.assignedTo) && (
          <button
            className="btn-clear-filters"
            onClick={() => setFilters({ status: '', assignedTo: '' })}
          >
            <FontAwesomeIcon icon={faTimes} /> Effacer
          </button>
        )}
      </div>

      <div className="courses-table-wrapper">
        {filteredCourses.length === 0 ? (
          <p className="no-courses">Aucun cours trouvé.</p>
        ) : (
          <table className="courses-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Description</th>
                <th>Date début</th>
                <th>Date fin</th>
                <th>Heure</th>
                <th>Assigné à</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                  <td>{formatDate(course.startDate)}</td>
                  <td>{course.endDate ? formatDate(course.endDate) : '-'}</td>
                  <td>{course.startTime || '-'}</td>
                  <td>{getEnseignantName(course.assignedTo)}</td>
                  <td>
                    <span className={`badge status-${course.status}`}>
                      {statusLabel(course.status)}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-edit"
                      onClick={() => openEdit(course)}
                      title="Modifier"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(course.id)}
                      title="Supprimer"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <button className="close" onClick={closeModal}>&times;</button>
            <h3>{editingCourse ? 'Modifier le cours' : 'Nouveau cours'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Titre *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date de début *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date de fin</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Heure de début</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Statut</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="PLANNED">Planifié</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="COMPLETED">Terminé</option>
                    <option value="CANCELLED">Annulé</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Assigner à</label>
                <SearchableSelect
                  options={enseignants.map(e => ({ value: e.id, label: e.name }))}
                  value={formData.assignedTo}
                  onChange={(val) => setFormData({ ...formData, assignedTo: val })}
                  placeholder="Rechercher un enseignant..."
                  emptyLabel="Non assigné"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingCourse ? 'Mettre à jour' : 'Créer'}
                </button>
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
