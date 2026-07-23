import { useState, useEffect } from 'react';
import taskApi from '../api/taskApi';

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = () => {
    setLoading(true);
    taskApi.getAllTasks()
      .then((response) => {
        console.log('✅ Tâches reçues:', response.data);
        setTasks(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.error('❌ Erreur chargement des tâches:', err);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = (taskData) => taskApi.createTask(taskData).then((res) => {
    setTasks((prev) => [...prev, res.data]);
    return res;
  });

  const updateTask = (id, taskData) => taskApi.updateTask(id, taskData).then((res) => {
    setTasks((prev) => prev.map((t) => t.id === id ? res.data : t));
    return res;
  });

  const updateTaskStatus = (id, status) => taskApi.updateTaskStatus(id, status).then((res) => {
    setTasks((prev) => prev.map((t) => t.id === id ? res.data : t));
    return res;
  });

  const deleteTask = (id) => taskApi.deleteTask(id).then(() => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  });

  const refreshTasks = fetchTasks;

  return { tasks, setTasks, loading, error, createTask, updateTask, updateTaskStatus, deleteTask, refreshTasks };
}
