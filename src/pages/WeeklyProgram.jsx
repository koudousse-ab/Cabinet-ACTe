import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useTasks from '../hooks/useTasks';
import useProjects from '../hooks/useProjects';
import useEmployees from '../hooks/useEmployees';
import { formatDate, getWeekRange } from '../utils/dateUtils';
import { statusLabel } from '../utils/statusUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faCalendarWeek, faUser } from '@fortawesome/free-solid-svg-icons';
import './WeeklyProgram.css';

export default function WeeklyProgram() {
  const { user } = useAuth();
  const { tasks, loading } = useTasks();
  const { projects } = useProjects();
  const { employees } = useEmployees();

  const [weekStart, setWeekStart] = useState(getWeekRange(new Date()).start);
  const [weekEnd, setWeekEnd] = useState(getWeekRange(new Date()).end);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(user?.id || '');

  const isManager = user?.role === 'ADMIN' || user?.role === 'CHEF_PROJET';

  // Si l'utilisateur est manager, il peut choisir un employé, sinon il voit ses propres tâches
  const effectiveEmployeeId = isManager ? (selectedEmployeeId || user?.id) : user?.id;

  // Filtrer les tâches par employé
  const userTasks = tasks.filter(t => t.assignedTo === effectiveEmployeeId);
  
  // Construire la semaine complète (7 jours)
  const daysOfWeek = [];
  const current = new Date(weekStart);
  for (let i = 0; i < 7; i++) {
    const day = new Date(current);
    daysOfWeek.push(day);
    current.setDate(current.getDate() + 1);
  }

  // Regrouper les tâches par jour
  const tasksByDay = {};
  daysOfWeek.forEach(day => {
    const dateStr = day.toISOString().split('T')[0];
    tasksByDay[dateStr] = userTasks.filter(t => t.dueDate && t.dueDate === dateStr);
  });

  const getProjectName = (id) => {
    const p = projects.find(proj => proj.id === id);
    return p ? p.name : 'Projet inconnu';
  };

  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.name : 'Inconnu';
  };

  const handlePrint = () => window.print();

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="weekly-program">
      <header className="weekly-header">
        <h2><FontAwesomeIcon icon={faCalendarWeek} /> Programme de la semaine</h2>
        <div className="week-info">
          <p>Du <strong>{formatDate(weekStart)}</strong> au <strong>{formatDate(weekEnd)}</strong></p>
          <button className="btn-print" onClick={handlePrint}>
            <FontAwesomeIcon icon={faPrint} /> Exporter PDF
          </button>
        </div>
      </header>

      {isManager && (
        <div className="employee-filter">
          <label><FontAwesomeIcon icon={faUser} /> Voir le programme de :</label>
          <select value={selectedEmployeeId} onChange={e => setSelectedEmployeeId(Number(e.target.value))}>
            <option value="">-- Tous les employés --</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="week-grid">
        {daysOfWeek.map(day => {
          const dateStr = day.toISOString().split('T')[0];
          const dayTasks = tasksByDay[dateStr] || [];
          const isToday = new Date().toISOString().split('T')[0] === dateStr;

          return (
            <div key={dateStr} className={`day-card${isToday ? ' today' : ''}`}>
              <div className="day-header">
                <span className="day-name">
                  {day.toLocaleDateString('fr-FR', { weekday: 'long' })}
                </span>
                <span className="day-date">{formatDate(day)}</span>
              </div>
              <div className="day-tasks">
                {dayTasks.length === 0 ? (
                  <p className="no-task">Aucune tâche</p>
                ) : (
                  <ul>
                    {dayTasks.map(task => (
                      <li key={task.id}>
                        <span className="task-title">{task.title}</span>
                        <span className="task-project">{getProjectName(task.projectId)}</span>
                        <span className={`badge status-${task.status}`}>{statusLabel(task.status)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="week-footer">
        {isManager && selectedEmployeeId && (
          <p>Employé : {getEmployeeName(selectedEmployeeId)}</p>
        )}
        {!isManager && (
          <p>Mon programme</p>
        )}
      </div>
    </div>
  );
}
