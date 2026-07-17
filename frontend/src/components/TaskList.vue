<template>
  <div class="task-list-container">
    <div class="task-list-header">
      <h2>Gestion des Tâches</h2>
      <button @click="openCreateModal" class="btn btn-primary">
        <i class="fas fa-plus"></i> Nouvelle Tâche
      </button>
    </div>

    <!-- Filter Section -->
    <div class="filters">
      <div class="filter-group">
        <label for="projectFilter">Projet:</label>
        <select v-model="selectedProject" @change="fetchTasks" id="projectFilter">
          <option value="">Tous les projets</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="statusFilter">Statut:</label>
        <select v-model="selectedStatus" @change="fetchTasks" id="statusFilter">
          <option value="">Tous les statuts</option>
          <option value="TODO">À faire</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="REVIEW">En révision</option>
          <option value="DONE">Terminé</option>
          <option value="CANCELLED">Annulé</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="priorityFilter">Priorité:</label>
        <select v-model="selectedPriority" @change="fetchTasks" id="priorityFilter">
          <option value="">Toutes les priorités</option>
          <option value="LOW">Basse</option>
          <option value="MEDIUM">Moyenne</option>
          <option value="HIGH">Haute</option>
          <option value="URGENT">Urgente</option>
        </select>
      </div>
    </div>

    <!-- Tasks Table -->
    <div class="tasks-table-wrapper">
      <table class="tasks-table" v-if="tasks.length > 0">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Statut</th>
            <th>Priorité</th>
            <th>Assigné à</th>
            <th>Date limite</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id" :class="`status-${task.status}`">
            <td class="title">{{ task.title }}</td>
            <td>
              <span :class="`badge badge-${getStatusClass(task.status)}`">
                {{ getStatusLabel(task.status) }}
              </span>
            </td>
            <td>
              <span :class="`badge badge-${getPriorityClass(task.priority)}`">
                {{ task.priority }}
              </span>
            </td>
            <td>{{ task.assignedTo ? task.assignedTo : 'Non assigné' }}</td>
            <td>{{ formatDate(task.dueDate) }}</td>
            <td class="actions">
              <button @click="editTask(task)" class="btn btn-sm btn-info" title="Éditer">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deleteTask(task.id)" class="btn btn-sm btn-danger" title="Supprimer">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="no-tasks">
        <p>Aucune tâche trouvée</p>
      </div>
    </div>

    <!-- Task Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h3>{{ editingTaskId ? 'Éditer la Tâche' : 'Créer une Nouvelle T��che' }}</h3>
        
        <form @submit.prevent="saveTask">
          <div class="form-group">
            <label for="title">Titre *</label>
            <input v-model="formData.title" type="text" id="title" required>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea v-model="formData.description" id="description" rows="4"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="status">Statut *</label>
              <select v-model="formData.status" id="status" required>
                <option value="TODO">À faire</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="REVIEW">En révision</option>
                <option value="DONE">Terminé</option>
                <option value="CANCELLED">Annulé</option>
              </select>
            </div>

            <div class="form-group">
              <label for="priority">Priorité *</label>
              <select v-model="formData.priority" id="priority" required>
                <option value="LOW">Basse</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Haute</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="projectId">Projet *</label>
              <select v-model.number="formData.projectId" id="projectId" required>
                <option value="">Sélectionner un projet</option>
                <option v-for="project in projects" :key="project.id" :value="project.id">
                  {{ project.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="assignedTo">Assigné à</label>
              <select v-model.number="formData.assignedTo" id="assignedTo">
                <option value="">Sélectionner un employé</option>
                <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                  {{ employee.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="dueDate">Date limite</label>
              <input v-model="formData.dueDate" type="date" id="dueDate">
            </div>

            <div class="form-group">
              <label for="estimatedHours">Heures estimées</label>
              <input v-model.number="formData.estimatedHours" type="number" id="estimatedHours" step="0.5">
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Enregistrer</button>
            <button type="button" @click="closeModal" class="btn btn-secondary">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import taskService from '../services/taskService';

export default {
  name: 'TaskList',
  data() {
    return {
      tasks: [],
      projects: [],
      employees: [],
      selectedProject: '',
      selectedStatus: '',
      selectedPriority: '',
      showModal: false,
      editingTaskId: null,
      formData: {
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: '',
        assignedTo: null,
        dueDate: '',
        estimatedHours: null,
        actualHours: null
      }
    };
  },
  mounted() {
    this.fetchTasks();
    this.loadProjects();
    this.loadEmployees();
  },
  methods: {
    fetchTasks() {
      let promise;
      
      if (this.selectedProject && this.selectedStatus) {
        promise = taskService.getTasksByProjectAndStatus(this.selectedProject, this.selectedStatus);
      } else if (this.selectedProject) {
        promise = taskService.getTasksByProjectId(this.selectedProject);
      } else if (this.selectedStatus) {
        promise = taskService.getTasksByStatus(this.selectedStatus);
      } else if (this.selectedPriority) {
        promise = taskService.getTasksByPriority(this.selectedPriority);
      } else {
        promise = taskService.getAllTasks();
      }

      promise
        .then(response => {
          this.tasks = response.data;
        })
        .catch(error => {
          console.error('Error fetching tasks:', error);
          alert('Erreur lors du chargement des tâches');
        });
    },
    loadProjects() {
      // TODO: Load from project service
      this.projects = [
        { id: 1, name: 'Projet 1' },
        { id: 2, name: 'Projet 2' }
      ];
    },
    loadEmployees() {
      // TODO: Load from employee service
      this.employees = [
        { id: 1, name: 'Employé 1' },
        { id: 2, name: 'Employé 2' }
      ];
    },
    openCreateModal() {
      this.editingTaskId = null;
      this.resetForm();
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: '',
        assignedTo: null,
        dueDate: '',
        estimatedHours: null,
        actualHours: null
      };
    },
    saveTask() {
      if (!this.formData.title || !this.formData.projectId) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const promise = this.editingTaskId
        ? taskService.updateTask(this.editingTaskId, this.formData)
        : taskService.createTask(this.formData);

      promise
        .then(() => {
          alert(this.editingTaskId ? 'Tâche mise à jour' : 'Tâche créée');
          this.closeModal();
          this.fetchTasks();
        })
        .catch(error => {
          console.error('Error saving task:', error);
          alert('Erreur lors de l\'enregistrement de la tâche');
        });
    },
    editTask(task) {
      this.editingTaskId = task.id;
      this.formData = { ...task };
      this.showModal = true;
    },
    deleteTask(id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche?')) {
        taskService.deleteTask(id)
          .then(() => {
            alert('Tâche supprimée');
            this.fetchTasks();
          })
          .catch(error => {
            console.error('Error deleting task:', error);
            alert('Erreur lors de la suppression de la tâche');
          });
      }
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('fr-FR');
    },
    getStatusLabel(status) {
      const labels = {
        'TODO': 'À faire',
        'IN_PROGRESS': 'En cours',
        'REVIEW': 'En révision',
        'DONE': 'Terminé',
        'CANCELLED': 'Annulé'
      };
      return labels[status] || status;
    },
    getStatusClass(status) {
      const classes = {
        'TODO': 'warning',
        'IN_PROGRESS': 'info',
        'REVIEW': 'secondary',
        'DONE': 'success',
        'CANCELLED': 'danger'
      };
      return classes[status] || 'secondary';
    },
    getPriorityClass(priority) {
      const classes = {
        'LOW': 'success',
        'MEDIUM': 'info',
        'HIGH': 'warning',
        'URGENT': 'danger'
      };
      return classes[priority] || 'secondary';
    }
  }
};
</script>

<style scoped>
.task-list-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.task-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.task-list-header h2 {
  margin: 0;
  color: #333;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filter-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.tasks-table-wrapper {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow-x: auto;
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;
}

.tasks-table thead {
  background-color: #f8f9fa;
}

.tasks-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #dee2e6;
}

.tasks-table td {
  padding: 15px;
  border-bottom: 1px solid #dee2e6;
}

.tasks-table tbody tr:hover {
  background-color: #f8f9fa;
}

.title {
  font-weight: 500;
  color: #0066cc;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background-color: #28a745;
  color: white;
}

.badge-info {
  background-color: #17a2b8;
  color: white;
}

.badge-warning {
  background-color: #ffc107;
  color: #333;
}

.badge-danger {
  background-color: #dc3545;
  color: white;
}

.badge-secondary {
  background-color: #6c757d;
  color: white;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #0066cc;
  color: white;
}

.btn-primary:hover {
  background-color: #0052a3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-sm {
  padding: 6px 10px;
  font-size: 12px;
}

.no-tasks {
  text-align: center;
  padding: 40px;
  color: #999;
}

/* Modal Styles */
.modal {
  display: block;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  margin: 10% auto;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover {
  color: #000;
}

.modal-content h3 {
  color: #333;
  margin-top: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .tasks-table {
    font-size: 12px;
  }

  .tasks-table th,
  .tasks-table td {
    padding: 10px;
  }
}
</style>
