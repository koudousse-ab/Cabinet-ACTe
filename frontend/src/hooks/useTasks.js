import { useState, useEffect, useCallback } from 'react';
import taskApi from '../api/taskApi';

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(() => {
    setLoading(true);
    return taskApi
      .getAllTasks()
      .then((response) => {
        setTasks(response.data);
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
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(
    (taskData) => taskApi.createTask(taskData).then((res) => {
      setTasks((prev) => [...prev, res.data]);
      return res.data;
    }),
    []
  );

  const updateTask = useCallback(
    (id, taskData) => taskApi.updateTask(id, taskData).then((res) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      return res.data;
    }),
    []
  );

  const updateTaskStatus = useCallback(
    (id, status) => taskApi.updateTaskStatus(id, status).then((res) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      return res.data;
    }),
    []
  );

  const deleteTask = useCallback(
    (id) => taskApi.deleteTask(id).then(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }),
    []
  );

  return { tasks, setTasks, loading, error, fetchTasks, createTask, updateTask, updateTaskStatus, deleteTask };
}
