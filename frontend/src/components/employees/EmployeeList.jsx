import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS, roleLabel } from '../../utils/statusUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import './EmployeeList.css';

export default function EmployeeList({ employees, deleteEmployee, openEdit }) {   // ← openEdit récupéré des props
  const { user } = useAuth();
  const navigate = useNavigate();
  const isManager = user?.role === 'ADMIN' || user?.role === 'CHEF_PROJET';

  const handleDelete = (id, name) => {
    if (window.confirm(`Supprimer l'employé ${name} ?`)) {
      deleteEmployee(id);
    }
  };

  return (
    <div className="employee-list">
      <div className="employee-list-header">
        <h2>Gestion des employés</h2>
        {isManager && (
          <button className="btn-add" onClick={() => openEdit(null)}>
            <FontAwesomeIcon icon={faUserPlus} /> Ajouter
          </button>
        )}
      </div>

      <div className="employee-table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>
                  <span className="role-badge role-text">{roleLabel(emp.role)}</span>
                </td>
                <td className="actions">
                  <button className="btn-icon" onClick={() => navigate(`/employees/${emp.id}`)} title="Voir">
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  {isManager && (
                    <>
                      <button className="btn-icon" onClick={() => openEdit(emp)} title="Éditer">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="btn-icon danger" onClick={() => handleDelete(emp.id, emp.name)} title="Supprimer">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}