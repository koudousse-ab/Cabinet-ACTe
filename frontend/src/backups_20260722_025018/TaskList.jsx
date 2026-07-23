import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import TaskForm from './TaskForm';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, STATUS_COLORS, PRIORITY_COLORS, statusLabel, priorityLabel } from '../../utils/statusUtils';
import './TaskList.css';

export default function TaskList({ tasks, createTask, updateTask, deleteTask, openEditId, projects, employees }) {
 const { user } = useAuth();
 const isManager = user?.role === 'ADMIN' || user?.role === 'CHEF_PROJET';
 const [filters, setFilters] = useState({ status: '', priority: '', project: '' });
 const [showForm, setShowForm] = useState(Boolean(openEditId));
 const [editingTask, setEditingTask] = useState(null);

 const filteredTasks = useMemo(() => {
 return tasks.filter((t) => {
 if (filters.status && t.status !== filters.status) return false;
 if (filters.priority && t.priority !== filters.priority) return false;
 if (filters.project && String(t.projectId) !== String(filters.project)) return false;
 return true;
 });
 }, [tasks, filters]);

 useMemo(() => {
 if (openEditId && tasks.length && !editingTask) {
 const task = tasks.find((t) => t.id === openEditId);
 if (task) {
 setEditingTask(task);
 setShowForm(true);
 }
 }
 }, [openEditId, tasks]);

 const openCreate = () => {
 setEditingTask(null);
 setShowForm(true);
 };

 const openEdit = (task) => {
 setEditingTask(task);
 setShowForm(true);
 };

 const handleSave = (formData) => {
 const promise = editingTask ? updateTask(editingTask.id, formData) : createTask(formData);
 promise
 .then(() => {
 setShowForm(false);
 setEditingTask(null);
 })
 .catch(() => alert("Erreur lors de l'enregistrement de la tâche"));
 };

 const handleDelete = (id) => {
 if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
 deleteTask(id).catch(() => alert('Erreur lors de la suppression de la tâche'));
 }
 };

 const employeeName = (employeeId) => {
 const employee = employees.find((e) => e.id === employeeId);
 return employee ? employee.name : `#${employeeId}`;
 };

 return (
 <div className="task-list-container">
 <div className="task-list-header">
 <h2>Gestion des tâches</h2>
 {isManager && <button className="btn-primary" onClick={openCreate}>+ Nouvelle tâche</button>}
 </div>

 <div className="filters">
 <div className="filter-group">
 <label>Projet</label>
 <select value={filters.project} onChange={(e) => setFilters((f) => ({ ...f, project: e.target.value }))}>
 <option value="">Tous les projets</option>
 {projects.map((p) => (
 <option key={p.id} value={p.id}>{p.name}</option>
))}
 </select>
 </div>
 <div className="filter-group">
 <label>Statut</label>
 <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
 <option value="">Tous les statuts</option>
 {STATUS_OPTIONS.map((s) => (
 <option key={s} value={s}>{statusLabel(s)}</option>
))}
 </select>
 </div>
 <div className="filter-group">
 <label>Priorité</label>
 <select value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}>
 <option value="">Toutes les priorités</option>
 {PRIORITY_OPTIONS.map((p) => (
 <option key={p} value={p}>{priorityLabel(p)}</option>
))}
 </select>
 </div>
 </div>

 <div className="tasks-table-wrapper">
 {filteredTasks.length > 0 ? (
 <table className="tasks-table">
 <thead>
 <tr>
 <th>Titre</th>
 <th>Statut</th>
 <th>Priorité</th>
 <th>Assigné à</th>
 <th>Date limite</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody>
 {filteredTasks.map((task) => (
 <tr key={task.id}>
 <td className="title-cell" onClick={() => openEdit(task)}>{task.title}</td>
 <td>
 <span className="badge-text" style={{ }}>
 {statusLabel(task.status)}
 </span>
 </td>
 <td>
 <span className="badge-text" style={{ }}>
 {priorityLabel(task.priority)}
 </span>
 </td>
 <td>{task.assignedTo ? employeeName(task.assignedTo) : 'Non assigné'}</td>
 <td style={isOverdue(task) ? { color: '#B03A3A', fontWeight: 600 } : undefined}>
 {formatDate(task.dueDate)}
 </td>
 <td className="actions">
 {isManager && (
 <>
 <button className="btn-sm btn-info" onClick={() => openEdit(task)} title="Éditer"></button>
 <button className="btn-sm btn-danger" onClick={() => handleDelete(task.id)} title="Supprimer"></button>
 </>
)}
 </td>
 </tr>
))}
 </tbody>
 </table>
) : (
 <div className="no-tasks"><p>Aucune tâche trouvée</p></div>
)}
 </div>

 {showForm && (
 <TaskForm
 task={editingTask}
 projects={projects}
 employees={employees}
 onSave={handleSave}
 onClose={() => { setShowForm(false); setEditingTask(null); }}
 />
)}
 </div>
);
}
