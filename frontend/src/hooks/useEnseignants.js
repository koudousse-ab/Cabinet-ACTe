import { useState, useEffect, useCallback } from 'react';
import enseignantApi from '../api/enseignantApi';

export default function useEnseignants() {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnseignants = useCallback(() => {
    setLoading(true);
    return enseignantApi
      .getAllEnseignants()
      .then((response) => {
        setEnseignants(response.data);
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
    fetchEnseignants();
  }, [fetchEnseignants]);

  const createEnseignant = useCallback(
    (data) => enseignantApi.createEnseignant(data).then((res) => {
      setEnseignants((prev) => [...prev, res.data]);
      return res.data;
    }),
    []
  );

  const updateEnseignant = useCallback(
    (id, data) => enseignantApi.updateEnseignant(id, data).then((res) => {
      setEnseignants((prev) => prev.map((e) => (e.id === id ? res.data : e)));
      return res.data;
    }),
    []
  );

  const deleteEnseignant = useCallback(
    (id) => enseignantApi.deleteEnseignant(id).then(() => {
      setEnseignants((prev) => prev.filter((e) => e.id !== id));
    }),
    []
  );

  return { enseignants, loading, error, fetchEnseignants, createEnseignant, updateEnseignant, deleteEnseignant };
}
