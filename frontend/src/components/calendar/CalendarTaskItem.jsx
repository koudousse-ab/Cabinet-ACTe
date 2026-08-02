import { isOverdue } from '../../utils/dateUtils';
import { PRIORITY_COLORS } from '../../utils/statusUtils';
import './CalendarTaskItem.css';

export default function CalendarTaskItem({ task, onDragStart, onOpen }) {
 return (
 <div
 className={`calendar-task-item${task.status === 'DONE' ? ' done' : ''}${isOverdue(task) ? ' overdue' : ''}`}
 draggable
 onDragStart={() => onDragStart(task)}
 onClick={(e) => { e.stopPropagation(); onOpen(task); }}
 title={task.title}
 >
 <span className="dot" style={{ backgroundColor: PRIORITY_COLORS[task.priority] }} />
 <span className="label">{task.title}</span>
 </div>
);
}
