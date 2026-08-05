import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import useTasks from '../hooks/useTasks';
import useCourses from '../hooks/useCourses';
import useProjects from '../hooks/useProjects';
import useEnseignants from '../hooks/useEnseignants';
import useEtudiants from '../hooks/useEtudiants';
import SearchableSelect from '../components/common/SearchableSelect';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { WeeklyProgramPDF } from './WeeklyProgramPDF';
import { formatDate } from '../utils/dateUtils';
import { statusLabel } from '../utils/statusUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarWeek, faUser, faChalkboardTeacher,
  faTasks, faCheckCircle, faClock, faSearch,
  faGraduationCap, faBuilding, faList, faChartBar,
  faMoneyBill, faUsers, faMapPin, faThumbtack,
  faChevronLeft, faChevronRight, faTimes,
  faLocationDot, faBriefcase, faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import './WeeklyProgram.css';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 7);

export default function WeeklyProgram() {
  const { user } = useAuth();
  const { tasks, loading: tasksLoading, updateTaskStatus } = useTasks();
  const { courses, loading: coursesLoading, updateCourseStatus } = useCourses();
  const { projects } = useProjects();
  const { enseignants } = useEnseignants();
  const { etudiants } = useEtudiants();

  const [weekOffset, setWeekOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [selectedEnseignantId, setSelectedEnseignantId] = useState('');

  const isManager = user?.role === 'ADMIN' || user?.role === 'CHEF_PROJET';
  const isEtudiant = user?.role === 'ETUDIANT';
  // Admin/Chef de projet : par défaut le programme complet (aucun filtre) ; ils peuvent cibler un enseignant précis.
  const effectiveEnseignantId = isManager ? selectedEnseignantId : user?.id;

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

  const userTasks = useMemo(() => {
    if (isEtudiant) return []; // Les tâches de projet ne concernent pas les étudiants
    if (isManager && !effectiveEnseignantId) return tasks; // Programme complet
    return tasks.filter(t => String(t.assignedTo) === String(effectiveEnseignantId));
  }, [tasks, effectiveEnseignantId, isManager, isEtudiant]);

  const userCourses = useMemo(() => {
    if (isEtudiant) return courses.filter(c => c.classe === user?.classe);
    if (isManager && !effectiveEnseignantId) return courses; // Programme complet
    return courses.filter(c => String(c.assignedTo) === String(effectiveEnseignantId));
  }, [courses, effectiveEnseignantId, isManager, isEtudiant, user]);

  const filterBySearch = (items) => {
    if (!searchQuery) return items;
    return items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredTasks = filterBySearch(userTasks);
  const filteredCourses = filterBySearch(userCourses);

  const activitiesByDay = useMemo(() => {
    const map = {};
    DAYS.forEach((_, idx) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + idx);
      const dateStr = date.toISOString().split('T')[0]; // "YYYY-MM-DD"

      const dayTasks = filteredTasks.filter(t => t.dueDate === dateStr);

      // Comparaison directe sur les chaînes YYYY-MM-DD
      const dayCourses = filteredCourses.filter(c => {
        const startStr = c.startDate;          // "YYYY-MM-DD"
        const endStr = c.endDate || startStr;  // si pas de fin, on prend le même jour
        return dateStr >= startStr && dateStr <= endStr;
      });

      map[dateStr] = [
        ...dayTasks.map(t => ({ ...t, type: 'task' })),
        ...dayCourses.map(c => ({ ...c, type: 'course' }))
      ];
    });
    return map;
  }, [filteredTasks, filteredCourses, weekStart]);

  const getProjectName = (id) => {
    const p = projects.find(proj => proj.id === id);
    return p ? p.name : 'Projet inconnu';
  };

  const getEnseignantName = (id) => {
    const emp = enseignants.find(e => e.id === id);
    return emp ? emp.name : 'Inconnu';
  };

  const getStudentNames = (course) => {
    if (course.studentIds && course.studentIds.length > 0) {
      return etudiants.filter(e => course.studentIds.includes(e.id)).map(e => e.name).join(', ');
    }
    return course.classe || 'Aucun étudiant assigné';
  };

  // Préparer les données pour le PDF : on résout les noms des utilisateurs assignés ici,
  // car le composant PDF (React-PDF) ne peut pas accéder aux hooks de données de cette page.
  const pdfActivities = useMemo(() => {
    const pdfMap = {};
    DAYS.forEach((_, idx) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + idx);
      const dateStr = date.toISOString().split('T')[0];
      const dayActivities = activitiesByDay[dateStr] || [];
      pdfMap[dateStr] = dayActivities.map((act) => {
        if (act.type === 'course') {
          return {
            ...act,
            assignedToName: getEnseignantName(act.assignedTo),
            assignedUsersLabel: `Enseignant : ${getEnseignantName(act.assignedTo)} | Étudiants : ${getStudentNames(act)}`
          };
        }
        return {
          ...act,
          assignedToName: getEnseignantName(act.assignedTo),
          assignedUsersLabel: getEnseignantName(act.assignedTo)
        };
      });
    });
    return pdfMap;
  }, [activitiesByDay, weekStart, enseignants, etudiants]);

  const handleActivityClick = (activity, event) => {
    setSelectedActivity(activity);
    const rect = event.currentTarget.getBoundingClientRect();
    const popoverWidth = 340;
    const left = Math.min(rect.right + 16, window.innerWidth - popoverWidth - 20);
    setPopoverPosition({
      x: left,
      y: Math.min(rect.top - 20, window.innerHeight - 320)
    });
  };

  const closePopover = () => setSelectedActivity(null);

  const handleCompleteTask = (taskId) => {
    if (window.confirm('Marquer cette tâche comme accomplie ?')) {
      updateTaskStatus(taskId, 'DONE').then(() => { alert('Tâche accomplie !'); closePopover(); });
    }
  };

  const handleCompleteCourse = (courseId) => {
    if (window.confirm('Marquer ce cours comme terminé ?')) {
      updateCourseStatus(courseId, 'COMPLETED').then(() => { alert('Cours terminé !'); closePopover(); });
    }
  };

  const stats = {
    total: userTasks.length,
    todo: userTasks.filter(t => t.status === 'TODO').length,
    inProgress: userTasks.filter(t => t.status === 'IN_PROGRESS').length,
    done: userTasks.filter(t => t.status === 'DONE').length
  };

  const loading = tasksLoading || coursesLoading;
  if (loading) return <div className="loading">Chargement...</div>;

  const displayedEnseignant = effectiveEnseignantId ? getEnseignantName(effectiveEnseignantId) : 'Tous les enseignants';

  return (
    <div className="weekly-program">
      <header className="weekly-header">
        <div className="header-left">
          <h2><FontAwesomeIcon icon={faCalendarWeek} /> Programme de la semaine</h2>
          <span className="week-badge">
            {formatDate(weekStart)} — {formatDate(weekEnd)}
          </span>
          {isManager && effectiveEnseignantId && (
            <span className="enseignant-badge">
              <FontAwesomeIcon icon={faUser} /> {displayedEnseignant}
            </span>
          )}
        </div>
        <div className="header-actions">
          <PDFDownloadLink
            document={<WeeklyProgramPDF 
              weekStart={weekStart} 
              weekEnd={weekEnd} 
              activitiesByDay={pdfActivities}
              enseignantName={isManager ? displayedEnseignant : null}
            />}
            fileName="programme_semaine.pdf"
            className="btn-print"
          >
            {({ loading }) => (loading ? 'Génération...' : <><FontAwesomeIcon icon={faFilePdf} /> Exporter PDF</>)}
          </PDFDownloadLink>
        </div>
      </header>

      <div className="stats-bar">
        <div className="stats-items">
          <span className="stat-item"><FontAwesomeIcon icon={faTasks} /> Total : {stats.total}</span>
          <span className="stat-item todo"><FontAwesomeIcon icon={faClock} /> À faire : {stats.todo}</span>
          <span className="stat-item inprogress">En cours : {stats.inProgress}</span>
          <span className="stat-item done">Accomplies : {stats.done}</span>
        </div>
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isManager && (
        <div className="enseignant-filter">
          <label><FontAwesomeIcon icon={faUser} /> Voir le programme de :</label>
          <SearchableSelect
            options={enseignants.map(e => ({ value: e.id, label: e.name }))}
            value={selectedEnseignantId}
            onChange={(val) => setSelectedEnseignantId(Number(val))}
            placeholder="Rechercher un enseignant..."
            emptyLabel="-- Tous les enseignants --"
          />
        </div>
      )}

      <div className="week-nav">
        <button onClick={() => setWeekOffset(prev => prev - 1)}>
          <FontAwesomeIcon icon={faChevronLeft} /> Semaine précédente
        </button>
        <button onClick={() => setWeekOffset(prev => prev + 1)}>
          Semaine suivante <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      <div className="days-grid">
        {DAYS.map((day, idx) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + idx);
          const dateStr = date.toISOString().split('T')[0];
          const dayActivities = activitiesByDay[dateStr] || [];
          const isToday = new Date().toDateString() === date.toDateString();

          const sortedActivities = [...dayActivities].sort((a, b) => {
            if (a.type === 'course' && b.type === 'task') return -1;
            if (a.type === 'task' && b.type === 'course') return 1;
            const timeA = a.type === 'course' ? (a.startTime || '00:00') : '23:59';
            const timeB = b.type === 'course' ? (b.startTime || '00:00') : '23:59';
            return timeA.localeCompare(timeB);
          });

          return (
            <div key={idx} className={`day-card${isToday ? ' today' : ''}`}>
              <div className="day-header-card">
                <span className="day-name-card">{day}</span>
                <span className="day-date-card">{date.getDate()} {date.toLocaleString('fr', { month: 'long' })}</span>
                {isToday && <span className="today-badge">Aujourd'hui</span>}
              </div>
              <div className="day-activities">
                {sortedActivities.length === 0 ? (
                  <p className="empty-day">Aucune activité planifiée</p>
                ) : (
                  sortedActivities.map(act => {
                    if (act.type === 'course') {
                      return (
                        <div
                          key={act.id}
                          className={`activity-block course status-${act.status}`}
                          onClick={(e) => handleActivityClick(act, e)}
                        >
                          <div className="block-header">
                            <span className="block-time">
                              {act.startTime || '07:00'}{act.endTime ? ` – ${act.endTime}` : ''}
                            </span>
                            <span className="block-badge course-badge"><FontAwesomeIcon icon={faGraduationCap} /> Cours</span>
                          </div>
                          <div className="block-title">{act.title}</div>
                          <div className="block-details">
                            <span><FontAwesomeIcon icon={faChalkboardTeacher} /> {getEnseignantName(act.assignedTo)}</span>
                            <span><FontAwesomeIcon icon={faUsers} /> {getStudentNames(act)}</span>
                          </div>
                          <button className="block-btn">Détails</button>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={act.id}
                          className={`activity-block task status-${act.status}`}
                          onClick={(e) => handleActivityClick(act, e)}
                        >
                          <div className="block-header">
                            <span className="block-time">
                              {act.dueDate ? formatDate(act.dueDate) : 'Sans date'}
                              {act.scheduledTime ? ` — ${act.scheduledTime}` : ''}
                            </span>
                            <span className="block-badge task-badge"><FontAwesomeIcon icon={faBriefcase} /> Projet</span>
                          </div>
                          <div className="block-title">{act.title}</div>
                          <div className="block-details">
                            <span><FontAwesomeIcon icon={faMapPin} /> {getProjectName(act.projectId)}</span>
                            <span><FontAwesomeIcon icon={faChalkboardTeacher} /> {getEnseignantName(act.assignedTo)}</span>
                          </div>
                          <div className="block-status">
                            <span className={`badge status-${act.status}`}>{statusLabel(act.status)}</span>
                          </div>
                          <button className="block-btn">Détails</button>
                        </div>
                      );
                    }
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedActivity && (
        <div
          className="popover"
          style={{
            top: popoverPosition.y,
            left: popoverPosition.x,
            position: 'fixed',
            zIndex: 999
          }}
        >
          <button className="popover-close" onClick={closePopover}><FontAwesomeIcon icon={faTimes} /></button>
          <div className="popover-content">
            <h4>{selectedActivity.title}</h4>
            <p className="popover-description">{selectedActivity.description || 'Aucune description'}</p>
            <hr />
            <ul className="popover-meta">
              {selectedActivity.type === 'course' && (
                <>
                  <li><FontAwesomeIcon icon={faGraduationCap} /> {selectedActivity.title}</li>
                  <li><FontAwesomeIcon icon={faList} /> Statut : {statusLabel(selectedActivity.status)}</li>
                  <li>
                    <FontAwesomeIcon icon={faClock} /> Horaire : {selectedActivity.startTime || 'Non défini'}
                    {selectedActivity.endTime ? ` – ${selectedActivity.endTime}` : ''}
                  </li>
                  <li><FontAwesomeIcon icon={faChalkboardTeacher} /> Enseignant : {getEnseignantName(selectedActivity.assignedTo)}</li>
                  <li><FontAwesomeIcon icon={faUsers} /> Étudiants : {getStudentNames(selectedActivity)}</li>
                </>
              )}
              {selectedActivity.type === 'task' && (
                <>
                  <li><FontAwesomeIcon icon={faBriefcase} /> Projet : {getProjectName(selectedActivity.projectId)}</li>
                  <li><FontAwesomeIcon icon={faClock} /> Date limite : {formatDate(selectedActivity.dueDate)}</li>
                  <li><FontAwesomeIcon icon={faChartBar} /> Priorité : {selectedActivity.priority}</li>
                  <li><FontAwesomeIcon icon={faMapPin} /> Site : à définir</li>
                  <li><FontAwesomeIcon icon={faMoneyBill} /> Budget : en cours</li>
                </>
              )}
            </ul>
            <div className="popover-actions">
              {selectedActivity.type === 'task' && selectedActivity.status !== 'DONE' && (
                <button className="btn-complete" onClick={() => handleCompleteTask(selectedActivity.id)}>
                  <FontAwesomeIcon icon={faCheckCircle} /> Marquer accomplie
                </button>
              )}
              {selectedActivity.type === 'course' && selectedActivity.status !== 'COMPLETED' && (
                <button className="btn-complete" onClick={() => handleCompleteCourse(selectedActivity.id)}>
                  <FontAwesomeIcon icon={faCheckCircle} /> Terminer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
