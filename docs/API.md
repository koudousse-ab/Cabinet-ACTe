# API Documentation - Cabinet ACTe MissionFlow

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
Actuellement pas d'authentification requise.

## Response Format
Tous les réponses sont en JSON.

---

## Tasks Endpoints

### 1. Create Task
**POST** `/tasks`

Créer une nouvelle tâche.

**Request:**
```json
{
  "title": "Développer le module",
  "description": "Développer le module tâches avec CRUD complet",
  "status": "TODO",
  "priority": "HIGH",
  "projectId": 1,
  "assignedTo": 1,
  "dueDate": "2026-12-31",
  "estimatedHours": 40.0
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "Développer le module",
  "description": "Développer le module tâches avec CRUD complet",
  "status": "TODO",
  "priority": "HIGH",
  "projectId": 1,
  "assignedTo": 1,
  "createdAt": "2026-07-18T12:00:00",
  "updatedAt": "2026-07-18T12:00:00",
  "dueDate": "2026-12-31",
  "estimatedHours": 40.0,
  "actualHours": null
}
```

---

### 2. Get All Tasks
**GET** `/tasks`

Récupérer toutes les tâches.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Tâche 1",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "projectId": 1,
    "assignedTo": 1,
    "dueDate": "2026-12-31",
    "estimatedHours": 40.0,
    "actualHours": 20.0
  },
  ...
]
```

---

### 3. Get Task by ID
**GET** `/tasks/{id}`

Récupérer une tâche spécifique.

**Parameters:**
- `id` (path, required): ID de la tâche

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Tâche 1",
  "description": "Description détaillée",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "projectId": 1,
  "assignedTo": 1,
  "createdAt": "2026-07-18T12:00:00",
  "updatedAt": "2026-07-18T14:30:00",
  "dueDate": "2026-12-31",
  "estimatedHours": 40.0,
  "actualHours": 20.0
}
```

**Error (404 Not Found):**
```json
{
  "status": 404,
  "message": "Task not found with id: 999",
  "error": "Task Not Found",
  "errorCode": "TASK_NOT_FOUND",
  "timestamp": "2026-07-18T12:00:00"
}
```

---

### 4. Update Task
**PUT** `/tasks/{id}`

Mettre à jour une tâche.

**Parameters:**
- `id` (path, required): ID de la tâche

**Request:**
```json
{
  "title": "Tâche mise à jour",
  "description": "Nouvelle description",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "projectId": 1,
  "assignedTo": 2,
  "dueDate": "2026-12-31",
  "estimatedHours": 50.0,
  "actualHours": 25.0
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Tâche mise à jour",
  "description": "Nouvelle description",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "projectId": 1,
  "assignedTo": 2,
  "createdAt": "2026-07-18T12:00:00",
  "updatedAt": "2026-07-18T15:00:00",
  "dueDate": "2026-12-31",
  "estimatedHours": 50.0,
  "actualHours": 25.0
}
```

---

### 5. Delete Task
**DELETE** `/tasks/{id}`

Supprimer une tâche.

**Parameters:**
- `id` (path, required): ID de la tâche

**Response (204 No Content):**
```
(empty body)
```

---

### 6. Get Tasks by Project
**GET** `/tasks/project/{projectId}`

Récupérer toutes les tâches d'un projet.

**Parameters:**
- `projectId` (path, required): ID du projet

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Tâche 1",
    "projectId": 1,
    "status": "DONE",
    "priority": "HIGH"
  },
  ...
]
```

---

### 7. Get Tasks by Assigned Employee
**GET** `/tasks/assigned/{employeeId}`

Récupérer toutes les tâches assignées à un employé.

**Parameters:**
- `employeeId` (path, required): ID de l'employé

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Tâche 1",
    "assignedTo": 1,
    "status": "IN_PROGRESS",
    "priority": "HIGH"
  },
  ...
]
```

---

### 8. Get Tasks by Status
**GET** `/tasks/status/{status}`

Récupérer les tâches par statut.

**Parameters:**
- `status` (path, required): TODO, IN_PROGRESS, REVIEW, DONE, CANCELLED

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Tâche 1",
    "status": "TODO",
    "priority": "HIGH"
  },
  ...
]
```

---

### 9. Get Tasks by Priority
**GET** `/tasks/priority/{priority}`

Récupérer les tâches par priorité.

**Parameters:**
- `priority` (path, required): LOW, MEDIUM, HIGH, URGENT

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Tâche 1",
    "priority": "HIGH",
    "status": "IN_PROGRESS"
  },
  ...
]
```

---

### 10. Get Tasks by Project and Status
**GET** `/tasks/project/{projectId}/status/{status}`

Récupérer les tâches d'un projet avec un statut spécifique.

**Parameters:**
- `projectId` (path, required): ID du projet
- `status` (path, required): TODO, IN_PROGRESS, REVIEW, DONE, CANCELLED

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Tâche 1",
    "projectId": 1,
    "status": "IN_PROGRESS"
  },
  ...
]
```

---

### 11. Get Overdue Tasks
**GET** `/tasks/overdue`

Récupérer les tâches en retard (dueDate passée et statut != DONE).

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Tâche urgente",
    "dueDate": "2026-07-15",
    "status": "TODO",
    "priority": "URGENT"
  },
  ...
]
```

---

### 12. Get Upcoming Tasks
**GET** `/tasks/upcoming?startDate=2026-07-20&endDate=2026-07-31`

Récupérer les tâches à venir dans une période.

**Parameters:**
- `startDate` (query, required): Format YYYY-MM-DD
- `endDate` (query, required): Format YYYY-MM-DD

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Tâche prochaine",
    "dueDate": "2026-07-25",
    "status": "TODO",
    "priority": "HIGH"
  },
  ...
]
```

---

### 13. Update Task Status
**PATCH** `/tasks/{id}/status/{status}`

Mettre à jour uniquement le statut d'une tâche.

**Parameters:**
- `id` (path, required): ID de la tâche
- `status` (path, required): TODO, IN_PROGRESS, REVIEW, DONE, CANCELLED

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Tâche 1",
  "status": "DONE",
  "priority": "HIGH",
  "updatedAt": "2026-07-18T16:00:00"
}
```

---

### 14. Get Task Count by Status
**GET** `/tasks/count/project/{projectId}/status/{status}`

Compter les tâches d'un projet par statut.

**Parameters:**
- `projectId` (path, required): ID du projet
- `status` (path, required): TODO, IN_PROGRESS, REVIEW, DONE, CANCELLED

**Response (200 OK):**
```json
5
```

---

## Enums

### TaskStatus
- `TODO` - À faire
- `IN_PROGRESS` - En cours
- `REVIEW` - En révision
- `DONE` - Terminé
- `CANCELLED` - Annulé

### TaskPriority
- `LOW` - Basse
- `MEDIUM` - Moyenne
- `HIGH` - Haute
- `URGENT` - Urgente

---

## Error Responses

### 400 Bad Request
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "title": "Title is required",
    "projectId": "Project ID is required"
  },
  "timestamp": 1689677600000
}
```

### 404 Not Found
```json
{
  "status": 404,
  "message": "Task not found with id: 999",
  "error": "Task Not Found",
  "errorCode": "TASK_NOT_FOUND",
  "timestamp": "2026-07-18T12:00:00",
  "path": "/api/v1/tasks/999"
}
```

### 500 Internal Server Error
```json
{
  "status": 500,
  "message": "An unexpected error occurred",
  "error": "Connection refused",
  "timestamp": "2026-07-18T12:00:00"
}
```

---

## Testing with cURL

### Create
```bash
curl -X POST http://localhost:8080/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "status": "TODO",
    "priority": "HIGH",
    "projectId": 1
  }'
```

### Read
```bash
curl http://localhost:8080/api/v1/tasks
curl http://localhost:8080/api/v1/tasks/1
```

### Update
```bash
curl -X PUT http://localhost:8080/api/v1/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task",
    "status": "IN_PROGRESS",
    "priority": "MEDIUM",
    "projectId": 1
  }'
```

### Delete
```bash
curl -X DELETE http://localhost:8080/api/v1/tasks/1
```

---

## Testing with Postman

1. Importer les endpoints dans Postman
2. Configurer les variables:
   - `base_url`: http://localhost:8080/api/v1
   - `task_id`: 1
3. Tester chaque endpoint

---

## Rate Limiting
Aucune limite actuellement.

## CORS
Autorisé pour: `http://localhost:5173`, `http://localhost:3000`

---

Pour plus d'informations, voir [README.md](../README.md)
