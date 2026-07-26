import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import useTasks from '../hooks/useTasks';
import useProjects from '../hooks/useProjects';
import useEnseignants from '../hooks/useEnseignants';
import { formatDate } from '../utils/dateUtils';
import { statusLabel, priorityLabel } from '../utils/statusUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faList, faFilter, faTimes, faClock,
  faTasks, faCheckCircle, faEye, faCheck,
  faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import './EnseignantTasksPage.css';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function EnseignantTasksPage() {
  const { user } = useAuth();
  const { tasks, loading, updateTaskStatus } = useTasks();
  const { projects } = useProjects();
  const { enseignants } = useEnseignants();
  const [statusFilter, setStatusFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const myTasks = tasks.filter(t => String(t.assignedTo) === String(user?.id));

  const filteredTasks = useMemo(() => {
    return myTasks.filter(t => {
      if (statusFilter && t.status !== statusFilter) return false;
      if (projectFilter && t.projectId !== Number(projectFilter)) return false;
      return true;
    });
  }, [myTasks, statusFilter, projectFilter]);

  const getWeekStart = (offset) => {
    const now = new Date();
    const day = now.getDay();
    const diff = (day === 0 ? 6 : day - 1) + offset * 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const weekStart = getWeekStart(weekOffset);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const tasksByDay = useMemo(() => {
    const map = {};
    DAYS.forEach((_, idx) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + idx);
      const dateStr = date.toISOString().split('T')[0];
      map[dateStr] = filteredTasks.filter(t => t.dueDate === dateStr);
    });
    return map;
  }, [filteredTasks, weekStart]);

  const getProjectName = (id) => {
    const p = projects.find(proj => proj.id === id);
    return p ? p.name : 'Projet inconnu';
  };

  const getEnseignantName = (id) => {
    const emp = enseignants.find(e => e.id === id);
    return emp ? emp.name : 'Inconnu';
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleComplete = (taskId) => {
    if (window.confirm('Marquer cette tâche comme terminée ?')) {
      updateTaskStatus(taskId, 'DONE')
        .then(() => {
          alert('<FontAwesomeIcon icon={faCheckCircle} /> Tâche marquée comme terminée.');
          setShowModal(false);
        })
        .catch(() => alert('<FontAwesomeIcon icon={faTimesCircle} /> Erreur lors de la mise à jour.'));
    }
  };

  const total = myTasks.length;
  const todo = myTasks.filter(t => t.status === 'TODO').length;
  const inProgress = myTasks.filter(t => t.status === 'IN_PROGRESS').length;
  const done = myTasks.filter(t => t.status === 'DONE').length;

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="enseignant-tasks-page">
      <header className="page-header">
        <h2><FontAwesomeIcon icon={faTasks} /> Mes tâches</h2>
        <div className="stats-row">
          <span className="stat-badge"><FontAwesomeIcon icon={faTasks} /> Total : {total}</span>
          <span className="stat-badge todo"><FontAwesomeIcon icon={faClock} /> À faire : {todo}</span>
          <span className="stat-badge inprogress">En cours : {inProgress}</span>
          <span className="stat-badge done"><FontAwesomeIcon icon={faCheckCircle} /> Terminées : {done}</span>
        </div>
      </header>

      <div className="filters-bar">
        <div className="filter-group">
          <label><FontAwesomeIcon icon={faFilter} /> Statut :</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Tous</option>
            <option value="TODO">À faire</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="DONE">Terminée</option>
            <option value="BLOCKED">Bloquée</option>
            <option value="CANCELLED">Annulée</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Projet :</label>
          <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)}>
            <option value="">Tous</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        {(statusFilter || projectFilter) && (
          <button className="btn-clear-filters" onClick={() => { setStatusFilter(''); setProjectFilter(''); }}>
            <FontAwesomeIcon icon={faTimes} /> Effacer
          </button>
        )}
        <div className="week-nav">
          <button onClick={() => setWeekOffset(prev => prev - 1)}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span>{formatDate(weekStart)} – {formatDate(weekEnd)}</span>
          <button onClick={() => setWeekOffset(prev => prev + 1)}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="grid-header">
          <div className="time-slot-header"></div>
          {DAYS.map((day, idx) => {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + idx);
            const isToday = new Date().toDateString() === date.toDateString();
            return (
              <div key={idx} className={`day-header${isToday ? ' today' : ''}`}>
                <span className="day-name">{day}</span>
                <span className="day-date">{date.getDate()}</span>
              </div>
            );
          })}
        </div>

        <div className="grid-body">
          <div className="task-row">
            <div className="task-label"></div>
            {DAYS.map((_, idx) => {
              const date = new Date(weekStart);
              date.setDate(weekStart.getDate() + idx);
              const dateStr = date.toISOString().split('T')[0];
              const dayTasks = tasksByDay[dateStr] || [];
              return (
                <div key={idx} className="task-cell">
                  {dayTasks.length === 0 ? (
                    <div className="no-task">Aucune tâche</div>
                  ) : (
                    dayTasks.map(task => {
                      const isDone = task.status === 'DONE';
                      return (
                        <div
                          key={task.id}
                          className={`task-block ${isDone ? 'done' : ''}`}
                          onClick={() => openModal(task)}
                        >
                          <div className="task-title">
                            {isDone && <FontAwesomeIcon icon={faCheck} style={{ color: '#28a745', marginRight: 4 }} />}
                            {task.title}
                          </div>
                          <div className="task-meta">
                            <span className="task-project">{getProjectName(task.projectId)}</span>
                            <span className={`badge status-${task.status}`}>{statusLabel(task.status)}</span>
                          </div>
                          <div className="task-actions">
                            {!isDone && (
                              <button
                                className="btn-complete-small"
                                onClick={(e) => { e.stopPropagation(); handleComplete(task.id); }}
                              >
                                <FontAwesomeIcon icon={faCheckCircle} /> Terminer
                              </button>
                            )}
                            {isDone && (
                              <span className="done-label"><FontAwesomeIcon icon={faCheck} /> Terminée</span>
                            )}
                            <button
                              className="btn-view-small"
                              onClick={(e) => { e.stopPropagation(); openModal(task); }}
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showModal && selectedTask && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content">
            <button className="close" onClick={() => setShowModal(false)}>&times;</button>
            <h3>{selectedTask.title}</h3>
            <div className="detail-item"><strong>Description :</strong> {selectedTask.description || 'Aucune'}</div>
            <div className="detail-item"><strong>Projet :</strong> {getProjectName(selectedTask.projectId)}</div>
            <div className="detail-item"><strong>Statut :</strong> {statusLabel(selectedTask.status)}</div>
            <div className="detail-item"><strong>Priorité :</strong> {priorityLabel(selectedTask.priority)}</div>
            <div className="detail-item"><strong>Date limite :</strong> {formatDate(selectedTask.dueDate)}</div>
            {selectedTask.assignedTo && (
              <div className="detail-item"><strong>Assigné à :</strong> {getEnseignantName(selectedTask.assignedTo)}</div>
            )}
            <div className="modal-actions">
              {selectedTask.status !== 'DONE' && (
                <button className="btn-complete" onClick={() => handleComplete(selectedTask.id)}>
                  <FontAwesomeIcon icon={faCheckCircle} /> Terminer la tâche
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
