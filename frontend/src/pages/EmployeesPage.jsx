import { useState } from 'react';
import useEmployees from '../hooks/useEmployees';
import EmployeeList from '../components/employees/EmployeeList';
import EmployeeForm from '../components/employees/EmployeeForm';
import './EmployeesPage.css';

export default function EmployeesPage() {
  const { employees, createEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const openEdit = (emp) => {
    setEditingEmployee(emp);
    setShowForm(true);
  };

  const handleSave = (formData) => {
    const promise = editingEmployee
      ? updateEmployee(editingEmployee.id, formData)
      : createEmployee(formData);
    promise
      .then(() => {
        setShowForm(false);
        setEditingEmployee(null);
      })
      .catch(() => alert("Erreur lors de l'enregistrement"));
  };

  return (
    <div className="employees-page">
      <EmployeeList
        employees={employees}
        deleteEmployee={deleteEmployee}
        openEdit={openEdit}
      />
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
