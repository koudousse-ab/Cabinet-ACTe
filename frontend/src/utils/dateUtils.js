export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR');
}

export function formatDateShort(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

export function formatDateTime(date) {
  if (!date) return '';
  return new Date(date).toLocaleString('fr-FR');
}

export function formatFullDate(date) {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isOverdue(task) {
  if (!task.dueDate || task.status === 'TERMINE') return false;
  return new Date(task.dueDate) < new Date(new Date().toDateString());
}
