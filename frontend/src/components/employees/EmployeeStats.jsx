import './EmployeeStats.css';

export default function EmployeeStats({ tasks }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'TERMINE').length;
  const inProgress = tasks.filter((t) => t.status === 'EN_COURS').length;
  const blocked = tasks.filter((t) => t.status === 'BLOQUE').length;

  return (
    <div className="employee-stats">
      <div className="stat-box">
        <div className="value">{total}</div>
        <div className="label">Tâches au total</div>
      </div>
      <div className="stat-box">
        <div className="value">{inProgress}</div>
        <div className="label">En cours</div>
      </div>
      <div className="stat-box">
        <div className="value">{done}</div>
        <div className="label">Terminées</div>
      </div>
      <div className="stat-box">
        <div className="value">{blocked}</div>
        <div className="label">Bloquées</div>
      </div>
    </div>
  );
}
