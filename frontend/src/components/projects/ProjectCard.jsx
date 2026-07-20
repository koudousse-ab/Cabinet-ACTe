import { formatDate } from '../../utils/dateUtils';
import { PROJECT_STATUS_COLORS, projectStatusLabel } from '../../utils/statusUtils';
import './ProjectCard.css';

export default function ProjectCard({ project, onClick }) {
  return (
    <div className="project-card" onClick={() => onClick(project)}>
      <div className="project-card-top">
        <h3>{project.name}</h3>
        <span className="badge" style={{ backgroundColor: PROJECT_STATUS_COLORS[project.status] }}>
          {projectStatusLabel(project.status)}
        </span>
      </div>
      <p className="project-client">👤 {project.client}</p>
      {(project.startDate || project.endDate) && (
        <p className="project-dates">
          📅 {formatDate(project.startDate)} → {formatDate(project.endDate) || '—'}
        </p>
      )}
    </div>
  );
}
