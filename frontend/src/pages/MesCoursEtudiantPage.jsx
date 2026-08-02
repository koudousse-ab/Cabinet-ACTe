import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import useCourses from '../hooks/useCourses';
import useEnseignants from '../hooks/useEnseignants';
import { formatDate } from '../utils/dateUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faChalkboardTeacher, faClock, faBook } from '@fortawesome/free-solid-svg-icons';
import './MesCoursEtudiantPage.css';

const STATUS_LABELS = {
  PLANNED: 'Planifié',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminé',
  CANCELLED: 'Annulé'
};

// Espace étudiant : liste des cours auxquels l'étudiant est assigné, avec le nom de
// l'enseignant responsable. Interface strictement en lecture seule : aucune action
// de modification, suppression ou altération n'est proposée ici.
export default function MesCoursEtudiantPage() {
  const { user } = useAuth();
  const { courses, loading } = useCourses();
  const { enseignants } = useEnseignants();

  const getEnseignantName = (id) => {
    const emp = enseignants.find((e) => e.id === id);
    return emp ? emp.name : 'Non assigné';
  };

  const sortedCourses = useMemo(() => {
    return [...courses].sort((a, b) => {
      const dateA = `${a.startDate || ''}T${a.startTime || '00:00'}`;
      const dateB = `${b.startDate || ''}T${b.startTime || '00:00'}`;
      return dateA.localeCompare(dateB);
    });
  }, [courses]);

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="mes-cours-etudiant-page">
      <header className="page-header">
        <h2><FontAwesomeIcon icon={faGraduationCap} /> Mes cours {user?.classe ? `— ${user.classe}` : ''}</h2>
      </header>

      {sortedCourses.length === 0 ? (
        <p className="no-courses">Aucun cours ne vous a été assigné pour le moment.</p>
      ) : (
        <div className="mes-cours-table-wrapper">
          <table className="mes-cours-table">
            <thead>
              <tr>
                <th>Cours</th>
                <th>Enseignant</th>
                <th>Date</th>
                <th>Horaire</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {sortedCourses.map((course) => (
                <tr key={course.id}>
                  <td>
                    <div className="course-title-cell">
                      <FontAwesomeIcon icon={faBook} />
                      <div>
                        <span className="course-title">{course.title}</span>
                        {course.description && <span className="course-description">{course.description}</span>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="enseignant-cell">
                      <FontAwesomeIcon icon={faChalkboardTeacher} /> {getEnseignantName(course.assignedTo)}
                    </span>
                  </td>
                  <td>
                    {formatDate(course.startDate)}
                    {course.endDate && course.endDate !== course.startDate ? ` – ${formatDate(course.endDate)}` : ''}
                  </td>
                  <td>
                    {course.startTime ? (
                      <span className="time-cell">
                        <FontAwesomeIcon icon={faClock} /> {course.startTime}
                        {course.endTime ? ` – ${course.endTime}` : ''}
                      </span>
                    ) : '—'}
                  </td>
                  <td>
                    <span className={`badge status-${course.status}`}>
                      {STATUS_LABELS[course.status] || course.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
