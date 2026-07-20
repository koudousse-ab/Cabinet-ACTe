import { useState, useEffect, useCallback } from 'react';
import projectApi from '../api/projectApi';

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback((params) => {
    setLoading(true);
    return projectApi
      .getAllProjects(params)
      .then((response) => {
        setProjects(response.data);
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
    fetchProjects();
  }, [fetchProjects]);

  const createProject = useCallback(
    (data) => projectApi.createProject(data).then((res) => {
      setProjects((prev) => [...prev, res.data]);
      return res.data;
    }),
    []
  );

  const updateProject = useCallback(
    (id, data) => projectApi.updateProject(id, data).then((res) => {
      setProjects((prev) => prev.map((p) => (p.id === id ? res.data : p)));
      return res.data;
    }),
    []
  );

  const deleteProject = useCallback(
    (id) => projectApi.deleteProject(id).then(() => {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }),
    []
  );

  return { projects, setProjects, loading, error, fetchProjects, createProject, updateProject, deleteProject };
}
