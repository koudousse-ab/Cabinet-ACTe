import { useState, useMemo } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReportsPDF } from './ReportsPDF';
import useTasks from '../hooks/useTasks';
import useProjects from '../hooks/useProjects';
import useEnseignants from '../hooks/useEnseignants';
import { statusLabel, priorityLabel } from '../utils/statusUtils';
import './ReportsPage.css';

export default function ReportsPage() {
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const { enseignants } = useEnseignants();
  const [filters, setFilters] = useState({ project: '', assignedTo: '', status: '', priority: '', startDate: '', endDate: '' });

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (filters.project && String(t.projectId) !== filters.project) return false;
      if (filters.assignedTo && String(t.assignedTo) !== filters.assignedTo) return false;
      if (filters.status && t.status !== filters.status) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.startDate && (!t.dueDate || t.dueDate < filters.startDate)) return false;
      if (filters.endDate && (!t.dueDate || t.dueDate > filters.endDate)) return false;
      return true;
    });
  }, [tasks, filters]);

  const getProjectName = (id) => {
    const p = projects.find(proj => proj.id === id);
    return p ? p.name : 'Projet inconnu';
  };

  const getEnseignantName = (id) => {
    const emp = enseignants.find(e => e.id === id);
    return emp ? emp.name : 'Non assigné';
  };

  const enhancedTasks = filteredTasks.map(task => ({
    ...task,
    assignedToName: getEnseignantName(task.assignedTo),
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
            <option value="">Tous les enseignants</option>
            {enseignants.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Statut</label>
          <select
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          >
            <option value="">Tous les statuts</option>
            <option value="TODO">À faire</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="REVIEW">En révision</option>
            <option value="DONE">Terminée</option>
            <option value="BLOCKED">Bloquée</option>
            <option value="CANCELLED">Annulée</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Priorité</label>
          <select
            value={filters.priority}
            onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
          >
            <option value="">Toutes les priorités</option>
            <option value="LOW">Basse</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="HIGH">Haute</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Du</label>
          <input type="date" value={filters.startDate} onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))} />
        </div>
        <div className="filter-group">
          <label>Au</label>
          <input type="date" value={filters.endDate} onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))} />
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
