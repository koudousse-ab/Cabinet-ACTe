import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import TaskCard from './TaskCard';
import { STATUS_OPTIONS, STATUS_COLORS, statusLabel } from '../../utils/statusUtils';
import './TaskDragDrop.css';

export default function TaskDragDrop({ tasks, updateTaskStatus, setTasks, onOpenTask, enseignants }) {
  const { user } = useAuth();
  const isManager = user?.role === 'ADMIN' || user?.role === 'CHEF_PROJET';
  const isEnseignant = user?.role === 'ENSEIGNANT';
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const tasksByStatus = (status) => tasks.filter((t) => t.status === status);

  const handleDrop = (status) => {
    setDragOverColumn(null);
    if (!draggedTask || draggedTask.status === status) {
      setDraggedTask(null);
      return;
    }
    const task = draggedTask;
    setDraggedTask(null);

    const previousStatus = task.status;
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status } : t)));

    updateTaskStatus(task.id, status).catch(() => {
      alert("Erreur lors du changement de statut");
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: previousStatus } : t)));
    });
  };

  // Vérifier si l'utilisateur peut glisser la tâche
  const canDrag = (task) => {
    return isManager || task.assignedTo === user?.id;
  };

  return (
    <div className="task-board">
      <div className="board-header">
        <h2>Tableau des tâches</h2>
        {!isManager && <p className="hint">Vous pouvez glisser uniquement vos propres tâches</p>}
      </div>

      <div className="board-columns">
        {STATUS_OPTIONS.map((status) => (
          <div
            key={status}
            className={`board-column${dragOverColumn === status ? ' drag-over' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setDragOverColumn(status)}
            onDrop={() => handleDrop(status)}
          >
            <div className="column-header" style={{ backgroundColor: STATUS_COLORS[status] }}>
              <span>{statusLabel(status)}</span>
              <span className="count-badge">{tasksByStatus(status).length}</span>
            </div>
            <div className="column-body">
              {tasksByStatus(status).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  draggable={canDrag(task)}
                  isDragging={draggedTask?.id === task.id}
                  onDragStart={setDraggedTask}
                  onDragEnd={() => setDraggedTask(null)}
                  onClick={() => !draggedTask && onOpenTask(task)}
                  enseignants={enseignants}
                />
              ))}
              {tasksByStatus(status).length === 0 && <p className="empty-column">Aucune tâche</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
