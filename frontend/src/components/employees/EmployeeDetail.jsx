import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import employeeApi from '../../api/employeeApi';
import EmployeeForm from './EmployeeForm';
import EmployeeStats from './EmployeeStats';
import ErrorCounter from './ErrorCounter';
import { STATUS_COLORS, statusLabel, ROLE_COLORS, roleLabel } from '../../utils/statusUtils';
import './EmployeeDetail.css';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => {
    employeeApi.getEmployeeById(id).then((res) => setEmployee(res.data));
    employeeApi.getEmployeeTasks(id).then((res) => setTasks(res.data));
    employeeApi.getEmployeeErrors(id).then((res) => setErrors(res.data));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = () => {
    if (window.confirm('Supprimer cet employé ?')) {
      employeeApi.deleteEmployee(id).then(() => navigate('/employees'));
    }
  };

  const handleSave = (formData) => {
    employeeApi.updateEmployee(id, formData).then(() => {
      setShowForm(false);
      load();
    });
  };

  if (!employee) return <p>Chargement...</p>;

  return (
    <div className="employee-detail">
      <button className="btn btn-back" onClick={() => navigate('/employees')}>← Retour aux employés</button>

      <div className="detail-header">
        <div className="detail-top">
          <h2>{employee.name}</h2>
          <div className="detail-actions">
            <span className="badge" style={{ backgroundColor: ROLE_COLORS[employee.role] }}>
              {roleLabel(employee.role)}
            </span>
            <button className="btn btn-info" onClick={() => setShowForm(true)}>✏️ Éditer</button>
            <button className="btn btn-danger" onClick={handleDelete}>🗑️ Supprimer</button>
          </div>
        </div>
        <p className="detail-meta">✉️ {employee.email}</p>
      </div>

      <div className="detail-section">
        <h3>Activité de la semaine</h3>
        <EmployeeStats tasks={tasks} />
      </div>

      <div className="two-columns">
        <div className="detail-section">
          <h3>Tâches assignées ({tasks.length})</h3>
          {tasks.length === 0 ? (
            <p>Aucune tâche assignée.</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="task-row" onClick={() => navigate(`/tasks?edit=${task.id}`)}>
                <span className="task-row-title">{task.title}</span>
                <span className="badge" style={{ backgroundColor: STATUS_COLORS[task.status] }}>
                  {statusLabel(task.status)}
                </span>
              </div>
            ))
          )}
        </div>

        <ErrorCounter employeeId={Number(id)} errors={errors} onErrorAdded={load} />
      </div>

      {showForm && (
        <EmployeeForm employee={employee} onSave={handleSave} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
