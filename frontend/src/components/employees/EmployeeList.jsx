import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeForm from './EmployeeForm';
import { ROLE_COLORS, roleLabel } from '../../utils/statusUtils';
import './EmployeeList.css';

export default function EmployeeList({ employees, createEmployee, updateEmployee, deleteEmployee }) {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const openCreate = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const openEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleSave = (formData) => {
    const promise = editingEmployee ? updateEmployee(editingEmployee.id, formData) : createEmployee(formData);
    promise
      .then(() => {
        setShowForm(false);
        setEditingEmployee(null);
      })
      .catch(() => alert("Erreur lors de l'enregistrement de l'employé"));
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      deleteEmployee(id).catch(() => alert("Erreur lors de la suppression de l'employé"));
    }
  };

  return (
    <div className="employee-list-container">
      <div className="employee-list-header">
        <h2>Gestion des employés</h2>
        <button className="btn-primary" onClick={openCreate}>+ Nouvel employé</button>
      </div>

      <div className="employees-table-wrapper">
        {employees.length > 0 ? (
          <table className="employees-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="name-cell" onClick={() => navigate(`/employees/${employee.id}`)}>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: ROLE_COLORS[employee.role] }}>
                      {roleLabel(employee.role)}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="btn-sm btn-info" onClick={() => openEdit(employee)} title="Éditer">✏️</button>
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(employee.id)} title="Supprimer">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-employees"><p>Aucun employé trouvé</p></div>
        )}
      </div>

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingEmployee(null); }}
        />
      )}
    </div>
  );
}
