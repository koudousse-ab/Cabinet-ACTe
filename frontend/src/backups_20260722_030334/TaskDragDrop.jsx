import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import TaskCard from './TaskCard';
import { STATUS_OPTIONS, STATUS_COLORS, statusLabel } from '../../utils/statusUtils';
import './TaskDragDrop.css';

export default function TaskDragDrop({ tasks, updateTaskStatus, setTasks, onOpenTask, employees }) {
 const { user } = useAuth();
 const isManager = user?.role === 'ADMIN' || user?.role === 'CHEF_PROJET';
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
 alert("Erreur lors du changement de statut, la tâche est restée dans sa colonne d'origine");
 setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: previousStatus } : t)));
 });
 };

 return (
 <div className="task-board">
 <div className="board-header">
 <h2>Tableau des tâches</h2>
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
 <div className="column-header" style={{ }}>
 <span>{statusLabel(status)}</span>
 <span className="count-badge">{tasksByStatus(status).length}</span>
 </div>
 <div className="column-body">
 {tasksByStatus(status).map((task) => (
 <TaskCard
 key={task.id}
 task={task}
 draggable={isManager}
 isDragging={draggedTask?.id === task.id}
 onDragStart={setDraggedTask}
 onDragEnd={() => setDraggedTask(null)}
 onClick={() => !draggedTask && onOpenTask(task)}
 employees={employees}
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
