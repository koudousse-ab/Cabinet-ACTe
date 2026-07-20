/**
 * Utilitaires de rappel automatique pour les tâches proches de leur échéance.
 * Pas de backend dédié : on s'appuie sur le champ dueDate déjà exposé par l'API Tâches.
 */

const notifiedTaskIds = new Set();

/**
 * Renvoie les tâches dont l'échéance tombe dans les `withinHours` prochaines heures
 * (ou déjà dépassée), en excluant les tâches terminées.
 */
export function getTasksDueSoon(tasks, withinHours = 24) {
  const now = new Date();
  const limit = new Date(now.getTime() + withinHours * 60 * 60 * 1000);

  return tasks.filter((task) => {
    if (!task.dueDate) return false;
    if (task.status === 'TERMINE') return false;
    const due = new Date(task.dueDate);
    return due <= limit;
  });
}

/**
 * Demande la permission d'afficher des notifications navigateur.
 */
export function requestNotificationPermission() {
  if (typeof Notification === 'undefined') return Promise.resolve('unsupported');
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Promise.resolve(Notification.permission);
  }
  return Notification.requestPermission();
}

/**
 * Affiche une notification navigateur pour une tâche, une seule fois par tâche.
 */
export function notifyTask(task) {
  if (notifiedTaskIds.has(task.id)) return false;
  notifiedTaskIds.add(task.id);

  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    const overdue = new Date(task.dueDate) < new Date(new Date().toDateString());
    new Notification(overdue ? 'Tâche en retard' : 'Échéance proche', {
      body: `${task.title} — ${new Date(task.dueDate).toLocaleDateString('fr-FR')}`,
      tag: `task-${task.id}`
    });
  }
  return true;
}

export function resetNotified() {
  notifiedTaskIds.clear();
}

/**
 * Démarre un polling qui interroge périodiquement les tâches (via fetchAllTasks) et
 * déclenche onDue() avec la liste des tâches proches de l'échéance.
 * Retourne une fonction stop() à appeler pour arrêter le polling.
 */
export function startReminderPolling(fetchAllTasks, { intervalMs = 5 * 60 * 1000, withinHours = 24, onDue } = {}) {
  let stopped = false;

  const check = () => {
    if (stopped) return;
    fetchAllTasks()
      .then((tasks) => {
        const dueSoon = getTasksDueSoon(tasks, withinHours);
        const freshlyNotified = dueSoon.filter((task) => !notifiedTaskIds.has(task.id));
        freshlyNotified.forEach(notifyTask);
        if (onDue) onDue(dueSoon);
      })
      .catch((error) => {
        console.error('Erreur lors de la vérification des rappels:', error);
      });
  };

  requestNotificationPermission();
  check();
  const intervalId = setInterval(check, intervalMs);

  return function stop() {
    stopped = true;
    clearInterval(intervalId);
  };
}
