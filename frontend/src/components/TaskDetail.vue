<template>
  <div class="task-detail-container" v-if="task">
    <div class="task-detail-header">
      <button @click="goBack" class="btn btn-secondary">← Retour</button>
      <h1>{{ task.title }}</h1>
      <div class="task-actions">
        <button @click="editTask" class="btn btn-primary">Éditer</button>
        <button @click="deleteTaskConfirm" class="btn btn-danger">Supprimer</button>
      </div>
    </div>

    <div class="task-detail-content">
      <div class="task-info">
        <div class="info-card">
          <h3>Informations Générales</h3>
          <div class="info-row">
            <label>Statut:</label>
            <span :class="`badge badge-${getStatusClass(task.status)}`">
              {{ getStatusLabel(task.status) }}
            </span>
          </div>
          <div class="info-row">
            <label>Priorité:</label>
            <span :class="`badge badge-${getPriorityClass(task.priority)}`">
              {{ task.priority }}
            </span>
          </div>
          <div class="info-row">
            <label>Projet:</label>
            <span>{{ task.projectId }}</span>
          </div>
          <div class="info-row">
            <label>Assigné à:</label>
            <span>{{ task.assignedTo || 'Non assigné' }}</span>
          </div>
        </div>

        <div class="info-card">
          <h3>Dates</h3>
          <div class="info-row">
            <label>Date limite:</label>
            <span>{{ formatDate(task.dueDate) }}</span>
          </div>
          <div class="info-row">
            <label>Créée le:</label>
            <span>{{ formatDateTime(task.createdAt) }}</span>
          </div>
          <div class="info-row">
            <label>Mise à jour:</label>
            <span>{{ formatDateTime(task.updatedAt) }}</span>
          </div>
        </div>

        <div class="info-card">
          <h3>Temps</h3>
          <div class="info-row">
            <label>Heures estimées:</label>
            <span>{{ task.estimatedHours || '-' }} h</span>
          </div>
          <div class="info-row">
            <label>Heures réelles:</label>
            <span>{{ task.actualHours || '-' }} h</span>
          </div>
          <div class="info-row" v-if="task.estimatedHours">
            <label>Progression:</label>
            <span>{{ getProgress() }}%</span>
          </div>
        </div>
      </div>

      <div class="task-description">
        <h3>Description</h3>
        <p>{{ task.description || 'Pas de description' }}</p>
      </div>

      <div class="task-actions-bottom">
        <div class="action-group">
          <label for="statusSelect">Changer le statut:</label>
          <select v-model="task.status" id="statusSelect" @change="updateStatus">
            <option value="TODO">À faire</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="REVIEW">En révision</option>
            <option value="DONE">Terminé</option>
            <option value="CANCELLED">Annulé</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <p>Chargement...</p>
  </div>
</template>

<script>
import taskService from '../services/taskService';

export default {
  name: 'TaskDetail',
  data() {
    return {
      task: null,
      taskId: null
    };
  },
  mounted() {
    this.taskId = this.$route.params.id;
    this.loadTask();
  },
  methods: {
    loadTask() {
      taskService.getTaskById(this.taskId)
        .then(response => {
          this.task = response.data;
        })
        .catch(error => {
          console.error('Error loading task:', error);
          alert('Erreur lors du chargement de la tâche');
          this.goBack();
        });
    },
    goBack() {
      this.$router.back();
    },
    editTask() {
      this.$router.push({
        name: 'TaskEdit',
        params: { id: this.task.id }
      });
    },
    deleteTaskConfirm() {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche?')) {
        taskService.deleteTask(this.task.id)
          .then(() => {
            alert('Tâche supprimée');
            this.goBack();
          })
          .catch(error => {
            console.error('Error deleting task:', error);
            alert('Erreur lors de la suppression de la tâche');
          });
      }
    },
    updateStatus() {
      taskService.updateTaskStatus(this.task.id, this.task.status)
        .then(response => {
          this.task = response.data;
          alert('Statut mis à jour');
        })
        .catch(error => {
          console.error('Error updating status:', error);
          alert('Erreur lors de la mise à jour du statut');
        });
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('fr-FR');
    },
    formatDateTime(dateTime) {
      if (!dateTime) return '';
      return new Date(dateTime).toLocaleString('fr-FR');
    },
    getProgress() {
      if (!this.task.estimatedHours) return 0;
      return Math.round((this.task.actualHours / this.task.estimatedHours) * 100);
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
.task-detail-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.task-detail-header {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.task-detail-header h1 {
  margin: 0;
  flex: 1;
  margin-left: 20px;
  color: #333;
}

.task-actions {
  display: flex;
  gap: 10px;
}

.task-detail-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.task-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.info-card {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #0066cc;
}

.info-card h3 {
  margin-top: 0;
  color: #333;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.info-row label {
  font-weight: 600;
  color: #666;
  flex: 0 0 40%;
}

.info-row span {
  color: #333;
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

.task-description {
  margin-bottom: 40px;
}

.task-description h3 {
  color: #333;
  margin-bottom: 15px;
}

.task-description p {
  color: #666;
  line-height: 1.6;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.task-actions-bottom {
  display: flex;
  gap: 20px;
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #e0e0e0;
}

.action-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-group label {
  font-weight: 600;
  color: #333;
}

.action-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
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

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

@media (max-width: 768px) {
  .task-detail-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-detail-header h1 {
    margin-left: 0;
    margin-top: 15px;
    width: 100%;
  }

  .task-actions {
    width: 100%;
    flex-direction: column;
  }

  .task-info {
    grid-template-columns: 1fr;
  }

  .task-actions-bottom {
    flex-direction: column;
  }

  .action-group select {
    min-width: 100%;
  }
}
</style>
