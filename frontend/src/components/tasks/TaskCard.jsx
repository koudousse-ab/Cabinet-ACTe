import { formatDateShort, isOverdue } from '../../utils/dateUtils';
import { PRIORITY_COLORS } from '../../utils/statusUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarDay, faUser } from '@fortawesome/free-solid-svg-icons';
import './TaskCard.css';

export default function TaskCard({ task, onClick, draggable, onDragStart, onDragEnd, isDragging, enseignants }) {
  const assigneeName = () => {
    if (!task.assignedTo) return null;
    const enseignant = (enseignants || []).find((e) => e.id === task.assignedTo);
    return enseignant ? enseignant.name : `#${task.assignedTo}`;
  };

  return (
    <div
      className={`task-card${isDragging ? ' dragging' : ''}`}
      draggable={draggable}
      onDragStart={draggable ? () => onDragStart(task) : undefined}
      onDragEnd={draggable ? onDragEnd : undefined}
      onClick={() => onClick && onClick(task)}
    >
      <div className="task-card-top">
        <span
          className="priority-dot"
          style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
          title={task.priority}
        />
        <span className="task-title">{task.title}</span>
      </div>
      <div className="task-card-meta">
        {task.scheduledTime && (
          <span className="scheduled-time"><FontAwesomeIcon icon={faClock} /> {task.scheduledTime}</span>
        )}
        {task.dueDate && (
          <span className={`due-date${isOverdue(task) ? ' overdue' : ''}`}>
            <FontAwesomeIcon icon={faCalendarDay} /> {formatDateShort(task.dueDate)}
          </span>
        )}
        {task.assignedTo && <span className="assignee"><FontAwesomeIcon icon={faUser} /> {assigneeName()}</span>}
      </div>
    </div>
  );
}
