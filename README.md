# Cabinet ACTe - MissionFlow 🚀

## 📋 Description

**MissionFlow** est un système complet de gestion de missions et tâches pour le Cabinet ACTe (cabinet togolais de conseil en stratégie, marketing digital et formation professionnelle). Il permet de centraliser les projets, suivre l'avancement des tâches, gérer les employés et générer des bilans hebdomadaires.

Développé en 7 jours par une équipe de 3 : **TCHEDRE**, **DJAGBARE** et **PAKPALI**, chacun responsable d'un module autonome mais partageant le même backend Spring Boot et la même base de données.

### Modules

| Module | Responsable | Statut |
|---|---|---|
| 📁 **Projets + Dashboard** | TCHEDRE  | ✅ Complet |
| 📝 **Tâches + Calendrier** | DJAGBARE | ✅ Complet |
| 👥 **Employés + Rapports** | PAKPALI  | ✅ Complet |

---

## 🛠️ Stack Technique

### Backend
- **Framework** : Spring Boot 3.1.5
- **Langage** : Java 17
- **Base de données** : PostgreSQL 14+ (H2 possible en dev)
- **Build** : Maven
- **ORM** : Hibernate (Spring Data JPA)
- **Validation** : Bean Validation (`jakarta.validation`)
- **Export PDF** : OpenPDF

### Frontend
- **Framework** : React 18
- **Build** : Vite
- **Routage** : React Router 6
- **HTTP** : Axios
- **Graphiques** : Recharts
- **Styling** : CSS par composant (pas de framework CSS imposé)

---

## 📁 Structure du Projet

```
Cabinet-ACTe/
├── backend/
│   ├── src/main/java/com/cabinet/acte/
│   │   ├── config/
│   │   │   └── CorsConfig.java
│   │   ├── controller/
│   │   │   ├── ProjectController.java      # Module 1
│   │   │   ├── DashboardController.java    # Module 1
│   │   │   ├── TaskController.java         # Module 2
│   │   │   ├── EmployeeController.java     # Module 3
│   │   │   └── ReportController.java       # Module 3
│   │   ├── service/ (+ impl/)
│   │   │   ├── ProjectService(Impl)
│   │   │   ├── DashboardService(Impl)
│   │   │   ├── TaskService(Impl)
│   │   │   ├── EmployeeService(Impl)
│   │   │   └── ReportService(Impl)
│   │   ├── repository/
│   │   │   ├── ProjectRepository.java
│   │   │   ├── TaskRepository.java
│   │   │   ├── EmployeeRepository.java
│   │   │   └── ErrorLogRepository.java
│   │   ├── entity/
│   │   │   ├── Project.java
│   │   │   ├── Task.java
│   │   │   ├── Employee.java
│   │   │   └── ErrorLog.java
│   │   ├── dto/
│   │   │   ├── ProjectDTO.java
│   │   │   ├── TaskDTO.java
│   │   │   ├── EmployeeDTO.java
│   │   │   ├── ErrorLogDTO.java
│   │   │   ├── DashboardStatsDTO.java
│   │   │   ├── ChartDataDTO.java
│   │   │   ├── RecentActivityDTO.java
│   │   │   └── WeeklyReportDTO.java
│   │   ├── exception/
│   │   │   ├── TaskException.java
│   │   │   └── GlobalExceptionHandler.java
│   │   └── CabinetActeApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── api/                  # Un fichier par ressource (axios)
│   │   │   ├── axiosConfig.js
│   │   │   ├── projectApi.js
│   │   │   ├── taskApi.js
│   │   │   ├── employeeApi.js
│   │   │   ├── reportApi.js
│   │   │   └── dashboardApi.js
│   │   ├── components/
│   │   │   ├── projects/         # ProjectList, ProjectForm, ProjectCard, ProjectDetail
│   │   │   ├── tasks/             # TaskList, TaskForm, TaskCard, TaskDragDrop (Kanban)
│   │   │   ├── calendar/          # CalendarView, CalendarTaskItem
│   │   │   ├── employees/         # EmployeeList, EmployeeForm, EmployeeDetail, EmployeeStats, ErrorCounter
│   │   │   └── dashboard/         # StatsCard, ProjectStatusChart, TaskStatusChart, ProgressChart, RecentActivity
│   │   ├── pages/
│   │   │   ├── HomePage.jsx              # Tableau de bord
│   │   │   ├── ProjectsPage.jsx / ProjectDetailPage.jsx
│   │   │   ├── TasksPage.jsx             # Bascule Liste / Kanban
│   │   │   ├── CalendarPage.jsx
│   │   │   ├── EmployeesPage.jsx / EmployeeDetailPage.jsx
│   │   │   └── ReportsPage.jsx
│   │   ├── hooks/
│   │   │   ├── useProjects.js
│   │   │   ├── useTasks.js
│   │   │   ├── useEmployees.js
│   │   │   └── useDashboard.js
│   │   ├── utils/
│   │   │   ├── dateUtils.js
│   │   │   ├── statusUtils.js      # Libellés/couleurs des enums (statuts, priorités, rôles)
│   │   │   ├── reminderUtils.js     # Rappels automatiques (Notification API)
│   │   │   └── printUtils.js        # Impression et téléchargement du bilan PDF
│   │   ├── App.jsx                  # Router + navigation
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.local
│
├── docs/
│   ├── API.md
│   ├── SETUP.md
│   └── DATABASE.md
│
├── README.md
├── README_TASKS.md            # ⚠️ Historique module Tâches — enums obsolètes, à ignorer
└── CONTRIBUTING.md
```

---

## 🚀 Démarrage Rapide

### Prérequis
- Java 17+
- Maven 3.6+
- Node.js 16+
- PostgreSQL 14+

### Installation Backend

```bash
git clone https://github.com/koudousse-ab/Cabinet-ACTe.git
cd Cabinet-ACTe/backend

# Créer la base de données
createdb mission_flow

# Installer les dépendances et lancer
mvn clean install
mvn spring-boot:run
```

L'API sera disponible sur `http://localhost:8080`.

Configuration par défaut (`application.properties`) :
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mission_flow
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
```

### Installation Frontend

```bash
cd ../frontend
npm install
echo 'VITE_API_URL=http://localhost:8080/api/v1' > .env.local
npm run dev
```

L'interface sera disponible sur `http://localhost:5173`.

---

## 🔌 API Endpoints

Base URL : `/api/v1`

### Projets (Module 1)
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/projects` | Liste tous les projets (filtres `status`, `client` en query params) |
| GET | `/projects/{id}` | Détail d'un projet |
| POST | `/projects` | Créer un projet |
| PUT | `/projects/{id}` | Mettre à jour un projet |
| DELETE | `/projects/{id}` | Supprimer un projet |
| GET | `/projects/{id}/tasks` | Tâches d'un projet |

Statuts (`ProjectStatus`) : `EN_COURS`, `TERMINE`, `EN_ATTENTE`, `ANNULE`

### Dashboard (Module 1)
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/dashboard/stats` | KPI globaux |
| GET | `/dashboard/charts` | Données pour les graphiques |
| GET | `/dashboard/recent` | Activités récentes |

### Tâches (Module 2)
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Liste toutes les tâches |
| GET | `/tasks/{id}` | Détail d'une tâche |
| POST | `/tasks` | Créer une tâche |
| PUT | `/tasks/{id}` | Mettre à jour une tâche |
| DELETE | `/tasks/{id}` | Supprimer une tâche |
| PATCH | `/tasks/{id}/status/{status}` | Changer le statut |
| GET | `/tasks/project/{projectId}` | Tâches d'un projet |
| GET | `/tasks/assigned/{employeeId}` | Tâches d'un employé |
| GET | `/tasks/status/{status}` / `/tasks/priority/{priority}` | Filtrage |
| GET | `/tasks/overdue` | Tâches en retard |
| GET | `/tasks/upcoming?startDate=&endDate=` | Tâches à venir |

Statuts (`TaskStatus`) : `A_FAIRE`, `EN_COURS`, `TERMINE`, `BLOQUE`
Priorités (`TaskPriority`) : `HAUTE`, `MOYENNE`, `BASSE`

### Employés (Module 3)
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/employees` | Liste tous les employés |
| GET | `/employees/{id}` | Détail d'un employé |
| POST | `/employees` | Ajouter un employé |
| PUT | `/employees/{id}` | Mettre à jour un employé |
| DELETE | `/employees/{id}` | Supprimer un employé |
| GET | `/employees/{id}/tasks` | Tâches d'un employé |
| GET | `/employees/{id}/errors` | Erreurs d'un employé |
| POST | `/errors` | Enregistrer une erreur |

Rôles (`EmployeeRole`) : `ADMIN`, `CHEF_PROJET`, `EMPLOYE`

### Rapports (Module 3)
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/reports/weekly?weekStart=YYYY-MM-DD` | Bilan hebdomadaire (JSON) |
| GET | `/reports/weekly/export?weekStart=&employeeId=` | Export PDF du bilan |

---

## 🧪 Tests

```bash
# Backend
cd backend && mvn test

# Frontend
cd frontend && npm run test
```

---

## 📦 Build & Déploiement

```bash
# Backend → JAR exécutable
cd backend && mvn clean package -DskipTests
# target/cabinet-acte-1.0.0.jar

# Frontend → statique
cd frontend && npm run build
# dist/
```

---

## 🤝 Contribution

Voir [CONTRIBUTING.md](./CONTRIBUTING.md). Workflow standard : fork → branche `feature/...` → commit → PR.

---

## 📋 Roadmap

- [x] Module Projets + Dashboard
- [x] Module Tâches + Calendrier
- [x] Module Employés + Rapports
- [ ] Authentification (dépendances déjà présentes : Spring Security + JJWT, non branchées)
- [ ] Notifications par email
- [ ] Application mobile

---

## 📞 Support

- Créer une [Issue](https://github.com/koudousse-ab/Cabinet-ACTe/issues)
- Consulter [docs/](./docs/) *(⚠️ non mis à jour depuis le passage à React — à vérifier avant de s'y fier)*

---

## 📄 Licence

Copyright © 2026 Cabinet ACTe. Tous droits réservés.

## 👨‍💻 Auteurs

- **TCHEDRE**  — Module Projets + Dashboard
- **DJAGBARE** — Module Tâches + Calendrier
- **PAKPALI**  — Module Employés + Rapports

---

**Made with ❤️ by Cabinet ACTe**
