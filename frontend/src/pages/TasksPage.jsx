import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import useTasks from '../hooks/useTasks';
import useProjects from '../hooks/useProjects';
import useEmployees from '../hooks/useEmployees';
import { formatDate } from '../utils/dateUtils';
import { statusLabel, priorityLabel } from '../utils/statusUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faEdit, faTrash, faFilter,
  faTimes, faTasks
} from '@fortawesome/free-solid-svg-icons';
import './TasksPage.css';

export default function TasksPage() {
  const { user } = useAuth();
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const { projects } = useProjects();
  const { employees } = useEmployees();

  const [filters, setFilters] = useState({ project: '', status: '', priority: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    projectId: '',
    assignedTo: '',
    dueDate: ''
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (filters.project && String(t.projectId) !== filters.project) return false;
      if (filters.status && t.status !== filters.status) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      return true;
    });
  }, [tasks, filters]);

  const openCreate = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      projectId: '',
      assignedTo: '',
      dueDate: ''
    });
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'TODO',
      priority: task.priority || 'MEDIUM',
      projectId: String(task.projectId || ''),
      assignedTo: String(task.assignedTo || ''),
      dueDate: task.dueDate || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      projectId: formData.projectId ? Number(formData.projectId) : null,
      assignedTo: formData.assignedTo ? Number(formData.assignedTo) : null,
      dueDate: formData.dueDate || null
    };
    if (editingTask) {
      updateTask(editingTask.id, data)
        .then(() => closeModal())
        .catch(() => alert('Erreur lors de la mise à jour.'));
    } else {
      createTask(data)
        .then(() => closeModal())
        .catch(() => alert('Erreur lors de la création.'));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer définitivement cette tâche ?')) {
      deleteTask(id).catch(() => alert('Erreur lors de la suppression.'));
    }
  };

  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.name : 'Non assigné';
  };

  const getProjectName = (id) => {
    const p = projects.find(proj => proj.id === id);
    return p ? p.name : 'Projet inconnu';
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="admin-tasks-page">
      <header className="tasks-header">
        <h2><FontAwesomeIcon icon={faTasks} /> Gestion des tâches</h2>
        <button className="btn-create" onClick={openCreate}>
          <FontAwesomeIcon icon={faPlus} /> Nouvelle tâche
        </button>
      </header>

      <div className="filters-bar">
        <div className="filter-group">
          <label><FontAwesomeIcon icon={faFilter} /> Projet</label>
          <select
            value={filters.project}
            onChange={e => setFilters(f => ({ ...f, project: e.target.value }))}
          >
            <option value="">Tous les projets</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Statut</label>
          <select
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          >
            <option value="">Tous les statuts</option>
            <option value="TODO">À faire</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="DONE">Terminé</option>
            <option value="BLOCKED">Bloqué</option>
            <option value="CANCELLED">Annulé</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Priorité</label>
          <select
            value={filters.priority}
            onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
          >
            <option value="">Toutes les priorités</option>
            <option value="LOW">Basse</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="HIGH">Haute</option>
          </select>
        </div>
        {(filters.project || filters.status || filters.priority) && (
          <button
            className="btn-clear-filters"
            onClick={() => setFilters({ project: '', status: '', priority: '' })}
          >
            <FontAwesomeIcon icon={faTimes} /> Effacer
          </button>
        )}
      </div>

      <div className="tasks-table-wrapper">
        {filteredTasks.length === 0 ? (
          <p className="no-tasks">Aucune tâche trouvée.</p>
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Assigné à</th>
                <th>Statut</th>
                <th>Priorité</th>
                <th>Date limite</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{getEmployeeName(task.assignedTo)}</td>
                  <td>
                    <span className={`badge status-${task.status}`}>
                      {statusLabel(task.status)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge priority-${task.priority}`}>
                      {priorityLabel(task.priority)}
                    </span>
                  </td>
                  <td>{formatDate(task.dueDate)}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-edit"
                      onClick={() => openEdit(task)}
                      title="Modifier"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(task.id)}
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
            <h3>{editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}</h3>
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
                  <label>Statut *</label>
                  <select name="status" value={formData.status} onChange={handleChange} required>
                    <option value="TODO">À faire</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="DONE">Terminé</option>
                    <option value="BLOCKED">Bloqué</option>
                    <option value="CANCELLED">Annulé</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priorité *</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} required>
                    <option value="LOW">Basse</option>
                    <option value="MEDIUM">Moyenne</option>
                    <option value="HIGH">Haute</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Projet</label>
                  <select name="projectId" value={formData.projectId} onChange={handleChange}>
                    <option value="">Aucun</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Assigné à</label>
                  <select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
                    <option value="">Non assigné</option>
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Date limite</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingTask ? 'Mettre à jour' : 'Créer'}
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
