import { useState, useEffect } from 'react';
import employeeApi from '../api/employeeApi';

export default function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    employeeApi.getAllEmployees()
      .then(res => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { employees, loading, error };
}
