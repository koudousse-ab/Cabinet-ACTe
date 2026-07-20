import useEmployees from '../hooks/useEmployees';
import EmployeeList from '../components/employees/EmployeeList';

export default function EmployeesPage() {
  const { employees, createEmployee, updateEmployee, deleteEmployee } = useEmployees();

  return (
    <EmployeeList
      employees={employees}
      createEmployee={createEmployee}
      updateEmployee={updateEmployee}
      deleteEmployee={deleteEmployee}
    />
  );
}
