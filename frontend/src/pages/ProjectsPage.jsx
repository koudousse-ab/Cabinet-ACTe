import useProjects from '../hooks/useProjects';
import ProjectList from '../components/projects/ProjectList';

export default function ProjectsPage() {
  const { projects, createProject, updateProject } = useProjects();

  return (
    <ProjectList projects={projects} createProject={createProject} updateProject={updateProject} />
  );
}
