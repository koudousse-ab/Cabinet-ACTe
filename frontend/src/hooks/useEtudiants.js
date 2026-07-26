import { useState, useEffect, useCallback } from 'react';
import etudiantApi from '../api/etudiantApi';

export default function useEtudiants() {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEtudiants = useCallback(() => {
    setLoading(true);
    return etudiantApi
      .getAllEtudiants()
      .then((response) => {
        setEtudiants(response.data);
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
    fetchEtudiants();
  }, [fetchEtudiants]);

  const createEtudiant = useCallback(
    (data) => etudiantApi.createEtudiant(data).then((res) => {
      setEtudiants((prev) => [...prev, res.data]);
      return res.data;
    }),
    []
  );

  const updateEtudiant = useCallback(
    (id, data) => etudiantApi.updateEtudiant(id, data).then((res) => {
      setEtudiants((prev) => prev.map((e) => (e.id === id ? res.data : e)));
      return res.data;
    }),
    []
  );

  const deleteEtudiant = useCallback(
    (id) => etudiantApi.deleteEtudiant(id).then(() => {
      setEtudiants((prev) => prev.filter((e) => e.id !== id));
    }),
    []
  );

  const searchEtudiants = useCallback(
    (q) => etudiantApi.searchEtudiants(q).then((res) => res.data),
    []
  );

  return { etudiants, loading, error, fetchEtudiants, createEtudiant, updateEtudiant, deleteEtudiant, searchEtudiants };
}
