import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import etudiantApi from '../api/etudiantApi';
import { formatDate } from '../utils/dateUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faClock, faChevronLeft, faChevronRight, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import './WeeklyProgram.css';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function MonAgendaPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    etudiantApi.getProgramme(user.id)
      .then((res) => setCourses(res.data))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

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

  const coursesByDay = useMemo(() => {
    const map = {};
    DAYS.forEach((_, idx) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + idx);
      const dateStr = date.toISOString().split('T')[0];
      map[dateStr] = courses.filter(c => {
        const start = new Date(c.startDate);
        const end = c.endDate ? new Date(c.endDate) : start;
        return (start >= date && start < new Date(date.getTime() + 86400000)) ||
               (end >= date && end <= new Date(date.getTime() + 86400000));
      });
    });
    return map;
  }, [courses, weekStart]);

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="weekly-program">
      <header className="weekly-header">
        <div className="header-left">
          <h2><FontAwesomeIcon icon={faGraduationCap} /> Mon agenda {user?.classe ? `— ${user.classe}` : ''}</h2>
        </div>
      </header>

      <div className="week-nav">
        <button onClick={() => setWeekOffset(prev => prev - 1)}>
          <FontAwesomeIcon icon={faChevronLeft} /> Semaine précédente
        </button>
        <span className="week-badge">{formatDate(weekStart)} — {formatDate(weekEnd)}</span>
        <button onClick={() => setWeekOffset(prev => prev + 1)}>
          Semaine suivante <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      <div className="days-grid">
        {DAYS.map((day, idx) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + idx);
          const dateStr = date.toISOString().split('T')[0];
          const dayCourses = (coursesByDay[dateStr] || []).sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div key={idx} className={`day-card${isToday ? ' today' : ''}`}>
              <div className="day-header-card">
                <span className="day-name-card">{day}</span>
                <span className="day-date-card">{date.getDate()} {date.toLocaleString('fr', { month: 'long' })}</span>
              </div>
              <div className="day-activities">
                {dayCourses.length === 0 ? (
                  <p className="empty-day">Aucun cours planifié</p>
                ) : (
                  dayCourses.map(c => (
                    <div key={c.id} className={`activity-block course ${c.status}`}>
                      <div className="block-header">
                        <span className="block-time"><FontAwesomeIcon icon={faClock} /> {c.startTime || '—'}</span>
                      </div>
                      <div className="block-title">{c.title}</div>
                      {c.description && <div className="block-details"><span><FontAwesomeIcon icon={faLocationDot} /> {c.description}</span></div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
