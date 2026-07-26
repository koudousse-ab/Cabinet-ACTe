import { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import taskApi from '../../api/taskApi';
import projectApi from '../../api/projectApi';
import enseignantApi from '../../api/enseignantApi';
import CalendarTaskItem from './CalendarTaskItem';
import { toISODate, isSameDay, formatDateShort, formatFullDate as fmtFullDate } from '../../utils/dateUtils';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, statusLabel, priorityLabel } from '../../utils/statusUtils';
import { startReminderPolling, getTasksDueSoon } from '../../utils/reminderUtils';
import '../tasks/TaskForm.css';
import './CalendarView.css';

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function buildMonthDays(currentDate) {
 const year = currentDate.getFullYear();
 const month = currentDate.getMonth();
 const firstOfMonth = new Date(year, month, 1);
 const startOffset = (firstOfMonth.getDay() + 6) % 7;
 const gridStart = new Date(year, month, 1 - startOffset);

 const days = [];
 for (let i = 0; i < 42; i++) {
 const date = new Date(gridStart);
 date.setDate(gridStart.getDate() + i);
 days.push({
 key: date.toDateString(),
 date,
 inCurrentMonth: date.getMonth() === month,
 isToday: isSameDay(date, new Date())
 });
 }
 return days;
}

function buildWeekDays(currentDate) {
 const startOffset = (currentDate.getDay() + 6) % 7;
 const monday = new Date(currentDate);
 monday.setDate(currentDate.getDate() - startOffset);

 const days = [];
 for (let i = 0; i < 7; i++) {
 const date = new Date(monday);
 date.setDate(monday.getDate() + i);
 days.push({ key: date.toDateString(), date, isToday: isSameDay(date, new Date()) });
 }
 return days;
}

export default function CalendarView() {
 const navigate = useNavigate();
 const [tasks, setTasks] = useState([]);
 const [projects, setProjects] = useState([]);
 const [enseignants, setEnseignants] = useState([]);
 const [currentDate, setCurrentDate] = useState(new Date());
 const [viewMode, setViewMode] = useState('month');
 const [filters, setFilters] = useState({ status: '', priority: '', assignedTo: '' });
 const [draggedTask, setDraggedTask] = useState(null);
 const [dragOverDay, setDragOverDay] = useState(null);
 const [quickAddDate, setQuickAddDate] = useState(null);
 const [quickAddForm, setQuickAddForm] = useState({ title: '', priority: 'MOYENNE', projectId: '', assignedTo: '' });
 const [dueSoonBanner, setDueSoonBanner] = useState([]);

 const fetchTasks = useCallback(() => {
 return taskApi.getAllTasks().then((response) => {
 setTasks(response.data);
 setDueSoonBanner(getTasksDueSoon(response.data));
 return response.data;
 });
 }, []);

 useEffect(() => {
 fetchTasks();
 projectApi.getAllProjects().then((res) => setProjects(res.data));
 enseignantApi.getAllEnseignants().then((res) => setEnseignants(res.data));
 const stop = startReminderPolling(
 () => taskApi.getAllTasks().then((r) => r.data),
 { onDue: setDueSoonBanner }
);
 return stop;
 }, [fetchTasks]);

 const monthDays = useMemo(() => buildMonthDays(currentDate), [currentDate]);
 const weekDays = useMemo(() => buildWeekDays(currentDate), [currentDate]);

 const periodLabel = useMemo(() => {
 if (viewMode === 'month') {
 return currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
 }
 if (viewMode === 'week') {
 return `${formatDateShort(weekDays[0].date)} – ${formatDateShort(weekDays[6].date)}`;
 }
 return fmtFullDate(currentDate);
 }, [viewMode, currentDate, weekDays]);

 const tasksForDay = useCallback(
 (date) =>
 tasks.filter((task) => {
 if (!task.dueDate) return false;
 if (!isSameDay(new Date(task.dueDate), date)) return false;
 if (filters.status && task.status !== filters.status) return false;
 if (filters.priority && task.priority !== filters.priority) return false;
 if (filters.assignedTo && String(task.assignedTo) !== String(filters.assignedTo)) return false;
 return true;
 }),
 [tasks, filters]
);

 const navigatePeriod = (delta) => {
 const d = new Date(currentDate);
 if (viewMode === 'month') d.setMonth(d.getMonth() + delta);
 else if (viewMode === 'week') d.setDate(d.getDate() + delta * 7);
 else d.setDate(d.getDate() + delta);
 setCurrentDate(d);
 };

 const openQuickAdd = (date) => {
 setQuickAddForm({ title: '', priority: 'MOYENNE', projectId: '', assignedTo: '' });
 setQuickAddDate(date);
 };

 const submitQuickAdd = (e) => {
 e.preventDefault();
 if (!quickAddForm.title || !quickAddForm.projectId) {
 alert('Veuillez remplir les champs obligatoires');
 return;
 }
 taskApi
 .createTask({
 title: quickAddForm.title,
 description: '',
 status: 'A_FAIRE',
 priority: quickAddForm.priority,
 projectId: Number(quickAddForm.projectId),
 assignedTo: quickAddForm.assignedTo ? Number(quickAddForm.assignedTo) : null,
 dueDate: toISODate(quickAddDate)
 })
 .then(() => {
 setQuickAddDate(null);
 fetchTasks();
 })
 .catch(() => alert('Erreur lors de la création de la tâche'));
 };

 const handleDropOnDay = (date) => {
 setDragOverDay(null);
 if (!draggedTask) return;
 const task = draggedTask;
 setDraggedTask(null);

 const previousDueDate = task.dueDate;
 const newDueDate = toISODate(date);
 if (previousDueDate === newDueDate) return;

 setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, dueDate: newDueDate } : t)));
 taskApi.updateTask(task.id, { ...task, dueDate: newDueDate }).catch(() => {
 alert('Erreur lors du déplacement de la tâche');
 setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, dueDate: previousDueDate } : t)));
 });
 };

 const goToDetail = (task) => {
 // Pas de page de détail dédiée dans ce module : on ouvre l'édition rapide
 setQuickAddDate(null);
 navigate(`/tasks?edit=${task.id}`);
 };

 return (
 <div className="calendar-view">
 {dueSoonBanner.length > 0 && (
 <div className="reminder-banner">
 {dueSoonBanner.length} tâche(s) proche(s) de l'échéance ou en retard
 <button className="dismiss" onClick={() => setDueSoonBanner([])}><FontAwesomeIcon icon={faXmark} /></button>
 </div>
)}

 <div className="calendar-toolbar">
 <div className="nav-group">
 <button className="nav-btn" onClick={() => navigatePeriod(-1)}>‹</button>
 <span className="period-label">{periodLabel}</span>
 <button className="nav-btn" onClick={() => navigatePeriod(1)}>›</button>
 <button className="today-btn" onClick={() => setCurrentDate(new Date())}>Aujourd'hui</button>
 </div>

 <div className="mode-group">
 {['day', 'week', 'month'].map((mode) => (
 <button
 key={mode}
 className={`mode-btn${viewMode === mode ? ' active' : ''}`}
 onClick={() => setViewMode(mode)}
 >
 {{ day: 'Jour', week: 'Semaine', month: 'Mois' }[mode]}
 </button>
))}
 </div>

 <div className="filters">
 <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
 <option value="">Tous statuts</option>
 {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
 </select>
 <select value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}>
 <option value="">Toutes priorités</option>
 {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{priorityLabel(p)}</option>)}
 </select>
 <select value={filters.assignedTo} onChange={(e) => setFilters((f) => ({ ...f, assignedTo: e.target.value }))}>
 <option value="">Tous enseignants</option>
 {enseignants.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
 </select>
 </div>
 </div>

 {viewMode === 'month' && (
 <div className="month-grid">
 <div className="weekday-row">
 {WEEKDAY_LABELS.map((d) => <div key={d} className="weekday-cell">{d}</div>)}
 </div>
 <div className="days-grid">
 {monthDays.map((day) => (
 <div
 key={day.key}
 className={`day-cell${!day.inCurrentMonth ? ' other-month' : ''}${day.isToday ? ' today' : ''}${dragOverDay === day.key ? ' drag-over' : ''}`}
 onDragOver={(e) => e.preventDefault()}
 onDragEnter={() => setDragOverDay(day.key)}
 onDrop={() => handleDropOnDay(day.date)}
 onClick={() => openQuickAdd(day.date)}
 >
 <div className="day-number">{day.date.getDate()}</div>
 <div className="day-tasks">
 {tasksForDay(day.date).map((task) => (
 <CalendarTaskItem key={task.id} task={task} onDragStart={setDraggedTask} onOpen={goToDetail} />
))}
 </div>
 </div>
))}
 </div>
 </div>
)}

 {viewMode === 'week' && (
 <div className="week-grid">
 {weekDays.map((day) => (
 <div
 key={day.key}
 className={`week-day-column${day.isToday ? ' today' : ''}${dragOverDay === day.key ? ' drag-over' : ''}`}
 onDragOver={(e) => e.preventDefault()}
 onDragEnter={() => setDragOverDay(day.key)}
 onDrop={() => handleDropOnDay(day.date)}
 >
 <div className="week-day-header" onClick={() => openQuickAdd(day.date)}>
 <span className="weekday-name">{WEEKDAY_LABELS[day.date.getDay() === 0 ? 6 : day.date.getDay() - 1]}</span>
 <span className="day-number">{day.date.getDate()}</span>
 </div>
 <div className="week-day-tasks">
 {tasksForDay(day.date).map((task) => (
 <CalendarTaskItem key={task.id} task={task} onDragStart={setDraggedTask} onOpen={goToDetail} />
))}
 {tasksForDay(day.date).length === 0 && <p className="empty-day">—</p>}
 </div>
 </div>
))}
 </div>
)}

 {viewMode === 'day' && (
 <div className="day-list">
 <div className="day-list-header">
 <h3>{fmtFullDate(currentDate)}</h3>
 <button className="add-btn" onClick={() => openQuickAdd(currentDate)}>+ Nouvelle tâche</button>
 </div>
 {tasksForDay(currentDate).length === 0 ? (
 <div className="empty-day-list">Aucune tâche prévue ce jour.</div>
) : (
 <div className="day-list-items">
 {tasksForDay(currentDate).map((task) => (
 <div key={task.id} className="day-list-item" onClick={() => goToDetail(task)}>
 <span className="task-title">{task.title}</span>
 <span className="badge-text" style={{ }}>{statusLabel(task.status)}</span>
 </div>
))}
 </div>
)}
 </div>
)}

 {quickAddDate && (
 <div className="modal" onClick={(e) => e.target === e.currentTarget && setQuickAddDate(null)}>
 <div className="modal-content">
 <button className="close" onClick={() => setQuickAddDate(null)}>&times;</button>
 <h3>Nouvelle tâche — {fmtFullDate(quickAddDate)}</h3>
 <form onSubmit={submitQuickAdd}>
 <div className="form-group">
 <label>Titre *</label>
 <input
 type="text"
 value={quickAddForm.title}
 onChange={(e) => setQuickAddForm((f) => ({ ...f, title: e.target.value }))}
 required
 />
 </div>
 <div className="form-row">
 <div className="form-group">
 <label>Priorité</label>
 <select
 value={quickAddForm.priority}
 onChange={(e) => setQuickAddForm((f) => ({ ...f, priority: e.target.value }))}
 >
 {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{priorityLabel(p)}</option>)}
 </select>
 </div>
 <div className="form-group">
 <label>Projet *</label>
 <select
 value={quickAddForm.projectId}
 onChange={(e) => setQuickAddForm((f) => ({ ...f, projectId: e.target.value }))}
 required
 >
 <option value="">Sélectionner</option>
 {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
 </select>
 </div>
 </div>
 <div className="form-group">
 <label>Assigné à</label>
 <select
 value={quickAddForm.assignedTo}
 onChange={(e) => setQuickAddForm((f) => ({ ...f, assignedTo: e.target.value }))}
 >
 <option value="">Non assigné</option>
 {enseignants.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
 </select>
 </div>
 <div className="form-actions">
 <button type="submit" className="btn btn-primary">Créer</button>
 <button type="button" className="btn btn-secondary" onClick={() => setQuickAddDate(null)}>Annuler</button>
 </div>
 </form>
 </div>
 </div>
)}
 </div>
);
}
