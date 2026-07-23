import { useState, useMemo } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReportsPDF } from './ReportsPDF';
import useTasks from '../hooks/useTasks';
import useProjects from '../hooks/useProjects';
import useEmployees from '../hooks/useEmployees';
import { statusLabel, priorityLabel } from '../utils/statusUtils';
import './ReportsPage.css';

export default function ReportsPage() {
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const { employees } = useEmployees();
  const [filters, setFilters] = useState({ project: '', assignedTo: '' });

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (filters.project && String(t.projectId) !== filters.project) return false;
      if (filters.assignedTo && String(t.assignedTo) !== filters.assignedTo) return false;
      return true;
    });
  }, [tasks, filters]);

  const getProjectName = (id) => {
    const p = projects.find(proj => proj.id === id);
    return p ? p.name : 'Projet inconnu';
  };

  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.name : 'Non assigné';
  };

  const enhancedTasks = filteredTasks.map(task => ({
    ...task,
    assignedToName: getEmployeeName(task.assignedTo),
    projectName: getProjectName(task.projectId),
    statusLabel: statusLabel(task.status),
    priorityLabel: priorityLabel(task.priority)
  }));

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h2>Rapport des tâches</h2>
        <PDFDownloadLink
          document={<ReportsPDF tasks={enhancedTasks} />}
          fileName="rapport_taches.pdf"
          className="btn-download"
        >
          {({ loading }) => (loading ? 'Génération...' : 'Télécharger PDF')}
        </PDFDownloadLink>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Projet</label>
          <select
            value={filters.project}
            onChange={e => setFilters(f => ({ ...f, project: e.target.value }))}
          >
            <option value="">Tous les projets</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Assigné à</label>
          <select
            value={filters.assignedTo}
            onChange={e => setFilters(f => ({ ...f, assignedTo: e.target.value }))}
          >
            <option value="">Tous les employés</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        {enhancedTasks.length === 0 ? (
          <p className="no-data">Aucune tâche trouvée.</p>
        ) : (
          <table className="reports-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Projet</th>
                <th>Assigné à</th>
                <th>Statut</th>
                <th>Priorité</th>
                <th>Date limite</th>
              </tr>
            </thead>
            <tbody>
              {enhancedTasks.map(task => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.projectName}</td>
                  <td>{task.assignedToName}</td>
                  <td>{task.statusLabel}</td>
                  <td>{task.priorityLabel}</td>
                  <td>{task.dueDate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
