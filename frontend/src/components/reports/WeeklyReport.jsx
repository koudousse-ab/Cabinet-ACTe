import { useState, useEffect, useCallback } from 'react';
import reportApi from '../../api/reportApi';
import ReportExport from './ReportExport';
import { formatDate } from '../../utils/dateUtils';
import './WeeklyReport.css';

function mondayOf(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

export default function WeeklyReport() {
  const [weekStart, setWeekStart] = useState(mondayOf(new Date()));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(() => {
    setLoading(true);
    return reportApi
      .getWeeklyReport(weekStart)
      .then((res) => setReport(res.data))
      .finally(() => setLoading(false));
  }, [weekStart]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return (
    <div className="weekly-report">
      <div className="report-toolbar">
        <h2>Bilan hebdomadaire</h2>
        <div className="week-picker">
          <label>Semaine du</label>
          <input type="date" value={weekStart} onChange={(e) => setWeekStart(mondayOf(e.target.value))} />
        </div>
        <ReportExport weekStart={weekStart} />
      </div>

      {loading || !report ? (
        <p>Chargement...</p>
      ) : (
        <div id="weekly-report-content" className="report-content">
          <div className="report-header">
            <h2>Bilan hebdomadaire — Cabinet ACTe</h2>
            <p>Semaine du {formatDate(report.weekStart)} au {formatDate(report.weekEnd)}</p>
          </div>

          <div className="report-kpis">
            <div className="kpi-box">
              <div className="value">{report.tasksPlanned}</div>
              <div className="label">Tâches planifiées</div>
            </div>
            <div className="kpi-box">
              <div className="value">{report.tasksInProgress}</div>
              <div className="label">Tâches en cours</div>
            </div>
            <div className="kpi-box">
              <div className="value">{report.tasksCompleted}</div>
              <div className="label">Tâches terminées</div>
            </div>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Employé</th>
                <th>Tâches terminées</th>
                <th>Erreurs</th>
              </tr>
            </thead>
            <tbody>
              {report.employeeSummaries.length === 0 ? (
                <tr><td colSpan={3}>Aucun employé enregistré</td></tr>
              ) : (
                report.employeeSummaries.map((s) => (
                  <tr key={s.employeeId}>
                    <td>{s.employeeName}</td>
                    <td>{s.tasksCompleted}</td>
                    <td>{s.errorsCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
