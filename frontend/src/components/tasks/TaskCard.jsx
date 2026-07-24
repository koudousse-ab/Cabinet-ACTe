import { formatDateShort, isOverdue } from '../../utils/dateUtils';
import { PRIORITY_COLORS } from '../../utils/statusUtils';
import './TaskCard.css';

export default function TaskCard({ task, onClick, draggable, onDragStart, onDragEnd, isDragging, employees }) {
  const assigneeName = () => {
    if (!task.assignedTo) return null;
    const employee = (employees || []).find((e) => e.id === task.assignedTo);
    return employee ? employee.name : `#${task.assignedTo}`;
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
          <span className="scheduled-time">⏰ {task.scheduledTime}</span>
        )}
        {task.dueDate && (
          <span className={`due-date${isOverdue(task) ? ' overdue' : ''}`}>
            📅 {formatDateShort(task.dueDate)}
          </span>
        )}
        {task.assignedTo && <span className="assignee">👤 {assigneeName()}</span>}
      </div>
    </div>
  );
}
