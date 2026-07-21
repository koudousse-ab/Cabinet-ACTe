# Module Tâches - MissionFlow

## 📋 Vue d'ensemble

Ce module gère toutes les fonctionnalités liées aux tâches du projet MissionFlow. Il permet de cr��er, lire, mettre à jour et supprimer des tâches, ainsi que de gérer leur statut et leur priorité.

## 🗂️ Structure du projet

### Backend (Spring Boot)

```
backend/src/main/java/com/cabinet/acte/
├── entity/
│   └── Task.java                 # Entité Task
├── repository/
│   └── TaskRepository.java       # Interface de persistance
├── dto/
│   └── TaskDTO.java              # Data Transfer Object
├── service/
│   ├── TaskService.java          # Interface du service
│   └── impl/
│       └── TaskServiceImpl.java   # Implémentation du service
├── controller/
│   └── TaskController.java       # Contrôleur REST
└── exception/
    └── TaskException.java        # Exception personnalisée
```

### Frontend (Vue.js)

```
frontend/src/
├── components/
│   ├── TaskList.vue              # Liste des tâches
│   └── TaskDetail.vue            # Détail d'une tâche
└── services/
    └── taskService.js            # Service API
```

## 📝 Modèle de données

### Entité Task

| Champ | Type | Contrainte | Description |
|-------|------|-----------|-------------|
| id | Long | PRIMARY KEY | Identifiant unique |
| title | String | NOT NULL | Titre de la tâche |
| description | Text | - | Description détaillée |
| status | Enum | NOT NULL | Statut (TODO, IN_PROGRESS, REVIEW, DONE, CANCELLED) |
| priority | Enum | NOT NULL | Priorité (LOW, MEDIUM, HIGH, URGENT) |
| projectId | Long | NOT NULL, FK | Référence au projet |
| assignedTo | Long | FK | ID de l'employé assigné |
| createdAt | LocalDateTime | NOT NULL | Date de création |
| updatedAt | LocalDateTime | NOT NULL | Date de modification |
| dueDate | LocalDate | - | Date limite |
| estimatedHours | Double | - | Heures estimées |
| actualHours | Double | - | Heures réelles |

## 🔌 API REST Endpoints

### Créer une tâche
```http
POST /api/v1/tasks
Content-Type: application/json

{
  "title": "Tâche 1",
  "description": "Description de la tâche",
  "status": "TODO",
  "priority": "HIGH",
  "projectId": 1,
  "assignedTo": 1,
  "dueDate": "2024-12-31",
  "estimatedHours": 8.0
}
```

### Récupérer une tâche
```http
GET /api/v1/tasks/{id}
```

### Récupérer toutes les tâches
```http
GET /api/v1/tasks
```

### Récupérer les tâches d'un projet
```http
GET /api/v1/tasks/project/{projectId}
```

### Récupérer les tâches d'un employé
```http
GET /api/v1/tasks/assigned/{employeeId}
```

### Récupérer les tâches par statut
```http
GET /api/v1/tasks/status/{status}
```

### Récupérer les tâches par priorité
```http
GET /api/v1/tasks/priority/{priority}
```

### Récupérer les tâches par projet et statut
```http
GET /api/v1/tasks/project/{projectId}/status/{status}
```

### Récupérer les tâches en retard
```http
GET /api/v1/tasks/overdue
```

### Récupérer les tâches à venir
```http
GET /api/v1/tasks/upcoming?startDate=2024-01-01&endDate=2024-01-31
```

### Mettre à jour une tâche
```http
PUT /api/v1/tasks/{id}
Content-Type: application/json

{
  "title": "Tâche mise à jour",
  "description": "Nouvelle description",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "projectId": 1,
  "assignedTo": 2,
  "dueDate": "2024-12-31",
  "estimatedHours": 10.0,
  "actualHours": 5.0
}
```

### Mettre à jour le statut d'une tâche
```http
PATCH /api/v1/tasks/{id}/status/{status}
```

### Supprimer une tâche
```http
DELETE /api/v1/tasks/{id}
```

### Compter les tâches par statut
```http
GET /api/v1/tasks/count/project/{projectId}/status/{status}
```

## 🔧 Configuration Backend

### Dépendances Maven requises

```xml
<!-- JPA/Hibernate -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<!-- MySQL Driver -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>
```

### Configuration application.properties

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/mission_flow
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# Server
server.port=8080
server.servlet.context-path=/
```

## 🎨 Configuration Frontend

### Installer les dépendances

```bash
npm install axios
```

### Configurer la base URL API

Créer un fichier `.env.local`:
```
REACT_APP_API_URL=http://localhost:8080/api/v1
```

## 🚀 Utilisation

### Backend

1. **Cloner le dépôt** et naviguer vers le dossier backend
2. **Configurer la base de données** dans `application.properties`
3. **Exécuter l'application**:
   ```bash
   mvn spring-boot:run
   ```

### Frontend

1. **Naviguer vers le dossier frontend**
2. **Installer les dépendances**:
   ```bash
   npm install
   ```
3. **Démarrer le serveur de développement**:
   ```bash
   npm run serve
   ```

## ✅ Critères d'acceptation

- [x] Créer une tâche
- [x] Lire les tâches
- [x] Mettre à jour une tâche
- [x] Supprimer une tâche
- [x] Filtrer par statut
- [x] Filtrer par priorité
- [x] Filtrer par projet
- [x] Gérer le statut des tâches
- [x] Interface utilisateur complète

## 📞 Support

Pour toute question ou problème, veuillez créer une issue sur GitHub ou contacter koudousetchedre@gmail.com .
