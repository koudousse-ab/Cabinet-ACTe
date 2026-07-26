// ============================================
// STATUTS DES TÂCHES
// ============================================
export const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED', 'CANCELLED'];

export const STATUS_LABELS = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminé',
  BLOCKED: 'Bloqué',
  CANCELLED: 'Annulé'
};

export const STATUS_COLORS = {
  TODO: '#6c757d',
  IN_PROGRESS: '#e67e22',
  DONE: '#28a745',
  BLOCKED: '#dc3545',
  CANCELLED: '#6c757d'
};

export function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

// ============================================
// PRIORITÉS
// ============================================
export const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];

export const PRIORITY_LABELS = {
  LOW: 'Basse',
  MEDIUM: 'Moyenne',
  HIGH: 'Haute'
};

export const PRIORITY_COLORS = {
  LOW: '#28a745',
  MEDIUM: '#f39c12',
  HIGH: '#dc3545'
};

export function priorityLabel(priority) {
  return PRIORITY_LABELS[priority] || priority;
}

// ============================================
// STATUTS DES PROJETS
// ============================================
export const PROJECT_STATUS_OPTIONS = ['EN_COURS', 'TERMINE', 'EN_ATTENTE', 'ANNULE'];
export const PROJECT_STATUS_LABELS = {
  EN_COURS: 'En cours',
  TERMINE: 'Terminé',
  EN_ATTENTE: 'En attente',
  ANNULE: 'Annulé'
};
export const PROJECT_STATUS_COLORS = {
  EN_COURS: '#e67e22',
  TERMINE: '#28a745',
  EN_ATTENTE: '#ffc107',
  ANNULE: '#dc3545'
};
export function projectStatusLabel(status) {
  return PROJECT_STATUS_LABELS[status] || status;
}

// ============================================
// RÔLES
// ============================================
export const ROLE_OPTIONS = ['ADMIN', 'CHEF_PROJET', 'ENSEIGNANT', 'ETUDIANT'];
export const ROLE_LABELS = {
  ADMIN: 'Administrateur',
  CHEF_PROJET: 'Chef de projet',
  ENSEIGNANT: 'Enseignant',
  ETUDIANT: 'Étudiant'
};
export const ROLE_COLORS = {
  ADMIN: '#dc3545',
  CHEF_PROJET: '#0066cc',
  ENSEIGNANT: '#6c757d',
  ETUDIANT: '#8a6d3b'
};
export function roleLabel(role) {
  return ROLE_LABELS[role] || role;
}
