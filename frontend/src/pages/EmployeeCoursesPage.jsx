import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import useCourses from '../hooks/useCourses';
import useEmployees from '../hooks/useEmployees';
import { formatDate } from '../utils/dateUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook, faFilter, faTimes, faClock,
  faGraduationCap, faLocationDot, faUsers,
  faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import './EmployeeCoursesPage.css';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 07:00 → 18:00

export default function EmployeeCoursesPage() {
  const { user } = useAuth();
  const { courses, loading, updateCourseStatus } = useCourses();
  const { employees } = useEmployees();
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const myCourses = courses.filter(c => String(c.assignedTo) === String(user?.id));

  const filteredCourses = useMemo(() => {
    return myCourses.filter(c => {
      if (statusFilter && c.status !== statusFilter) return false;
      return true;
    });
  }, [myCourses, statusFilter]);

  // Calcul du début de semaine (Lundi)
  const getWeekStart = (offset) => {
    const now = new Date();
    const day = now.getDay(); // 0=Dim, 1=Lun...
    const diff = (day === 0 ? 6 : day - 1) + offset * 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const weekStart = getWeekStart(weekOffset);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  // Regrouper les cours par jour
  const coursesByDay = useMemo(() => {
    const map = {};
    DAYS.forEach((_, idx) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + idx);
      map[date.toDateString()] = filteredCourses.filter(c => {
        const start = new Date(c.startDate);
        const end = c.endDate ? new Date(c.endDate) : start;
        return (start >= date && start < new Date(date.getTime() + 86400000)) ||
               (end >= date && end <= new Date(date.getTime() + 86400000));
      });
    });
    return map;
  }, [filteredCourses, weekStart]);

  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.name : 'Inconnu';
  };

  const statusLabel = (status) => {
    const map = {
      PLANNED: 'Planifié',
      IN_PROGRESS: 'En cours',
      COMPLETED: 'Terminé',
      CANCELLED: 'Annulé'
    };
    return map[status] || status;
  };

  const statusColor = (status) => {
    const map = {
      PLANNED: '#6c757d',
      IN_PROGRESS: '#17a2b8',
      COMPLETED: '#28a745',
      CANCELLED: '#dc3545'
    };
    return map[status] || '#6c757d';
  };

  const getCoursePosition = (course) => {
    const start = new Date(course.startDate);
    const end = course.endDate ? new Date(course.endDate) : new Date(start.getTime() + 3600000);
    const startHour = course.startTime ? parseInt(course.startTime.split(':')[0]) : 7;
    const startMinute = course.startTime ? parseInt(course.startTime.split(':')[1]) : 0;
    const duration = (end - start) / 3600000; // en heures
    const top = (startHour - 7) + (startMinute / 60);
    const height = duration || 1;
    return { top, height };
  };

  const openModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleStatusUpdate = (courseId, newStatus) => {
    if (window.confirm('Changer le statut du cours ?')) {
      updateCourseStatus(courseId, newStatus)
        .then(() => {
          alert('Statut mis à jour.');
          setShowModal(false);
        })
        .catch(() => alert('Erreur.'));
    }
  };

  const total = myCourses.length;
  const planned = myCourses.filter(c => c.status === 'PLANNED').length;
  const inProgress = myCourses.filter(c => c.status === 'IN_PROGRESS').length;
  const completed = myCourses.filter(c => c.status === 'COMPLETED').length;

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="employee-courses-page">
      <header className="page-header">
        <h2><FontAwesomeIcon icon={faGraduationCap} /> Mes cours</h2>
        <div className="stats-row">
          <span className="stat-badge"><FontAwesomeIcon icon={faBook} /> Total : {total}</span>
          <span className="stat-badge planned"><FontAwesomeIcon icon={faClock} /> Planifiés : {planned}</span>
          <span className="stat-badge inprogress">En cours : {inProgress}</span>
          <span className="stat-badge completed">Terminés : {completed}</span>
        </div>
      </header>

      <div className="filters-bar">
        <div className="filter-group">
          <label><FontAwesomeIcon icon={faFilter} /> Statut :</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Tous</option>
            <option value="PLANNED">Planifié</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="COMPLETED">Terminé</option>
            <option value="CANCELLED">Annulé</option>
          </select>
        </div>
        {statusFilter && (
          <button className="btn-clear-filters" onClick={() => setStatusFilter('')}>
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
        {/* En-tête des jours */}
        <div className="grid-header">
          <div className="time-slot-header">Heure</div>
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

        {/* Grille des heures */}
        <div className="grid-body">
          {HOURS.map(hour => (
            <div key={hour} className="time-row">
              <div className="time-label">{String(hour).padStart(2, '0')}:00</div>
              {DAYS.map((_, dayIdx) => {
                const date = new Date(weekStart);
                date.setDate(weekStart.getDate() + dayIdx);
                const dateKey = date.toDateString();
                const dayCourses = coursesByDay[dateKey] || [];
                // On ne place les blocs que sur la première ligne de l'heure de début
                // Les blocs seront positionnés absolument à l'intérieur de chaque cellule
                return (
                  <div key={`${hour}-${dayIdx}`} className="day-cell">
                    {dayCourses.map(course => {
                      const { top, height } = getCoursePosition(course);
                      const startHour = course.startTime ? parseInt(course.startTime.split(':')[0]) : 7;
                      // Afficher le bloc uniquement si l'heure correspond
                      if (startHour !== hour) return null;
                      return (
                        <div
                          key={course.id}
                          className={`course-block status-${course.status}`}
                          style={{
                            top: (top % 1) * 100 + '%',
                            height: `${height * 100}%`,
                            borderLeftColor: statusColor(course.status)
                          }}
                          onClick={() => openModal(course)}
                        >
                          <div className="course-title">{course.title}</div>
                          <div className="course-meta">
                            {course.startTime && <span><FontAwesomeIcon icon={faClock} /> {course.startTime}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedCourse && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content">
            <button className="close" onClick={() => setShowModal(false)}>&times;</button>
            <h3>{selectedCourse.title}</h3>
            <div className="detail-item"><strong>Description :</strong> {selectedCourse.description || 'Aucune'}</div>
            <div className="detail-item"><strong>Début :</strong> {formatDate(selectedCourse.startDate)}</div>
            {selectedCourse.endDate && <div className="detail-item"><strong>Fin :</strong> {formatDate(selectedCourse.endDate)}</div>}
            {selectedCourse.startTime && <div className="detail-item"><strong>Heure :</strong> {selectedCourse.startTime}</div>}
            <div className="detail-item"><strong>Statut :</strong> {statusLabel(selectedCourse.status)}</div>
            <div className="detail-item"><strong>Assigné à :</strong> {getEmployeeName(selectedCourse.assignedTo)}</div>
            <div className="modal-actions">
              {selectedCourse.status === 'PLANNED' && (
                <button className="btn-start" onClick={() => handleStatusUpdate(selectedCourse.id, 'IN_PROGRESS')}>
                  Démarrer
                </button>
              )}
              {selectedCourse.status === 'IN_PROGRESS' && (
                <button className="btn-complete" onClick={() => handleStatusUpdate(selectedCourse.id, 'COMPLETED')}>
                  Terminer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
