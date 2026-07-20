import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useTasks from '../hooks/useTasks';
import useProjects from '../hooks/useProjects';
import useEmployees from '../hooks/useEmployees';
import TaskList from '../components/tasks/TaskList';
import TaskDragDrop from '../components/tasks/TaskDragDrop';
import TaskForm from '../components/tasks/TaskForm';
import './TasksPage.css';

export default function TasksPage() {
  const { tasks, setTasks, createTask, updateTask, updateTaskStatus, deleteTask } = useTasks();
  const { projects } = useProjects();
  const { employees } = useEmployees();
  const [view, setView] = useState('list');
  const [searchParams] = useSearchParams();
  const editIdParam = searchParams.get('edit');

  // Modale d'édition ouverte depuis le tableau Kanban (la vue Liste gère la sienne en interne)
  const [boardEditingTask, setBoardEditingTask] = useState(null);

  useEffect(() => {
    if (editIdParam) setView('list');
  }, [editIdParam]);

  return (
    <div className="tasks-page">
      <div className="view-switch">
        <button className={`switch-btn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')}>
          📋 Liste
        </button>
        <button className={`switch-btn${view === 'board' ? ' active' : ''}`} onClick={() => setView('board')}>
          🗂️ Tableau
        </button>
      </div>

      {view === 'list' ? (
        <TaskList
          tasks={tasks}
          createTask={createTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
          openEditId={editIdParam ? Number(editIdParam) : null}
          projects={projects}
          employees={employees}
        />
      ) : (
        <TaskDragDrop
          tasks={tasks}
          updateTaskStatus={updateTaskStatus}
          setTasks={setTasks}
          onOpenTask={setBoardEditingTask}
          employees={employees}
        />
      )}

      {boardEditingTask && (
        <TaskForm
          task={boardEditingTask}
          projects={projects}
          employees={employees}
          onSave={(formData) => {
            updateTask(boardEditingTask.id, formData)
              .then(() => setBoardEditingTask(null))
              .catch(() => alert("Erreur lors de l'enregistrement de la tâche"));
          }}
          onClose={() => setBoardEditingTask(null)}
        />
      )}
    </div>
  );
}
