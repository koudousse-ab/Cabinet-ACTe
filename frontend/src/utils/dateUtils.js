// src/utils/dateUtils.js
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const formatDateShort = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
};

export const formatFullDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const toISODate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

export const isOverdue = (task) => {
  if (!task.dueDate || task.status === 'DONE' || task.status === 'CANCELLED') return false;
  return new Date(task.dueDate) < new Date();
};

export const getWeekRange = (date) => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay()); // dimanche
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // samedi
  return { start, end };
};