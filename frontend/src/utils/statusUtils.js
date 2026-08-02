// ============================================
// Couleurs : toutes réfèrent les tokens CSS ACTe (frontend/src/styles/tokens.css)
// afin de rester cohérentes partout dans l'application et de suivre
// automatiquement le mode sombre. Une seule source de vérité par catégorie.
// ============================================

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
  TODO: 'var(--acte-slate)',
  IN_PROGRESS: 'var(--acte-warning)',
  DONE: 'var(--acte-success)',
  BLOCKED: 'var(--acte-danger)',
  CANCELLED: 'var(--acte-slate-soft)'
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
  LOW: 'var(--acte-success)',
  MEDIUM: 'var(--acte-warning)',
  HIGH: 'var(--acte-danger)'
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
  EN_COURS: 'var(--acte-warning)',
  TERMINE: 'var(--acte-success)',
  EN_ATTENTE: 'var(--acte-info)',
  ANNULE: 'var(--acte-danger)'
};
export function projectStatusLabel(status) {
  return PROJECT_STATUS_LABELS[status] || status;
}

// ============================================
// STATUTS DES COURS
// ============================================
export const COURSE_STATUS_LABELS = {
  PLANNED: 'Planifié',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminé',
  CANCELLED: 'Annulé'
};
export const COURSE_STATUS_COLORS = {
  PLANNED: 'var(--acte-info)',
  IN_PROGRESS: 'var(--acte-warning)',
  COMPLETED: 'var(--acte-success)',
  CANCELLED: 'var(--acte-danger)'
};
export function courseStatusLabel(status) {
  return COURSE_STATUS_LABELS[status] || status;
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
  ADMIN: 'var(--acte-navy)',
  CHEF_PROJET: 'var(--acte-info)',
  ENSEIGNANT: 'var(--acte-success)',
  ETUDIANT: 'var(--acte-slate)'
};
export function roleLabel(role) {
  return ROLE_LABELS[role] || role;
}
