export const STATUS_OPTIONS = ['A_FAIRE', 'EN_COURS', 'TERMINE', 'BLOQUE'];
export const PRIORITY_OPTIONS = ['HAUTE', 'MOYENNE', 'BASSE'];
export const PROJECT_STATUS_OPTIONS = ['EN_COURS', 'TERMINE', 'EN_ATTENTE', 'ANNULE'];

export const STATUS_LABELS = {
  A_FAIRE: 'À faire',
  EN_COURS: 'En cours',
  TERMINE: 'Terminé',
  BLOQUE: 'Bloqué'
};

export const PROJECT_STATUS_LABELS = {
  EN_COURS: 'En cours',
  TERMINE: 'Terminé',
  EN_ATTENTE: 'En attente',
  ANNULE: 'Annulé'
};

export const PROJECT_STATUS_COLORS = {
  EN_COURS: '#17a2b8',
  TERMINE: '#28a745',
  EN_ATTENTE: '#ffc107',
  ANNULE: '#dc3545'
};

export function projectStatusLabel(status) {
  return PROJECT_STATUS_LABELS[status] || status;
}

export const ROLE_OPTIONS = ['ADMIN', 'CHEF_PROJET', 'EMPLOYE'];

export const ROLE_LABELS = {
  ADMIN: 'Administrateur',
  CHEF_PROJET: 'Chef de projet',
  EMPLOYE: 'Employé'
};

export const ROLE_COLORS = {
  ADMIN: '#dc3545',
  CHEF_PROJET: '#0066cc',
  EMPLOYE: '#6c757d'
};

export function roleLabel(role) {
  return ROLE_LABELS[role] || role;
}

export const PRIORITY_LABELS = {
  HAUTE: 'Haute',
  MOYENNE: 'Moyenne',
  BASSE: 'Basse'
};

export const STATUS_COLORS = {
  A_FAIRE: '#6c757d',
  EN_COURS: '#17a2b8',
  TERMINE: '#28a745',
  BLOQUE: '#dc3545'
};

export const PRIORITY_COLORS = {
  HAUTE: '#dc3545',
  MOYENNE: '#ffc107',
  BASSE: '#28a745'
};

export function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

export function priorityLabel(priority) {
  return PRIORITY_LABELS[priority] || priority;
}
