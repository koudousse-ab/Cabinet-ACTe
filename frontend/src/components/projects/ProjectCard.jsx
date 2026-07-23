import { formatDate } from '../../utils/dateUtils';
import { projectStatusLabel } from '../../utils/statusUtils';
import './ProjectCard.css';

export default function ProjectCard({ project, onClick }) {
  return (
    <div className="project-card" onClick={() => onClick(project)}>
      <div className="project-card-header">
        <h3 className="project-name">{project.name}</h3>
        <span className="project-status">{projectStatusLabel(project.status)}</span>
      </div>
      <p className="project-client">Client : {project.client}</p>
      {(project.startDate || project.endDate) && (
        <p className="project-dates">
          {project.startDate && formatDate(project.startDate)}
          {project.startDate && project.endDate && ' → '}
          {project.endDate && formatDate(project.endDate)}
        </p>
      )}
    </div>
  );
}
