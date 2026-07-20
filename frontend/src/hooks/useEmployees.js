import { useState, useEffect, useCallback } from 'react';
import employeeApi from '../api/employeeApi';

export default function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(() => {
    setLoading(true);
    return employeeApi
      .getAllEmployees()
      .then((response) => {
        setEmployees(response.data);
        setError(null);
        return response.data;
      })
      .catch((err) => {
        setError(err);
        throw err;
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const createEmployee = useCallback(
    (data) => employeeApi.createEmployee(data).then((res) => {
      setEmployees((prev) => [...prev, res.data]);
      return res.data;
    }),
    []
  );

  const updateEmployee = useCallback(
    (id, data) => employeeApi.updateEmployee(id, data).then((res) => {
      setEmployees((prev) => prev.map((e) => (e.id === id ? res.data : e)));
      return res.data;
    }),
    []
  );

  const deleteEmployee = useCallback(
    (id) => employeeApi.deleteEmployee(id).then(() => {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    }),
    []
  );

  return { employees, loading, error, fetchEmployees, createEmployee, updateEmployee, deleteEmployee };
}
