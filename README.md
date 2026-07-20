# Cabinet ACTe - MissionFlow 🚀

## 📋 Description

**MissionFlow** est un système complet de gestion de missions et tâches pour le Cabinet ACTe. Il permet de créer, suivre et gérer efficacement les tâches au sein de projets.

### Modules
- ✅ **Module Tâches** - Gestion complète des tâches (CRUD, filtrage, statuts)
- 🔄 **Module Projets** - En développement
- 👥 **Module Employés** - En développement
- 📊 **Dashboard** - En développement
- 📅 **Calendrier** - En développement
- 📈 **Rapports** - En développement

---

## 🛠️ Stack Technique

### Backend
- **Framework**: Spring Boot 3.1.5
- **Language**: Java 17
- **Database**: PostgreSQL 14+
- **Build Tool**: Maven
- **ORM**: Hibernate (Spring Data JPA)

### Frontend
- **Framework**: Vue.js 3
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: CSS3

---

## 📁 Structure du Projet

```
Cabinet-ACTe/
├── backend/
│   ├── src/main/
│   │   ├── java/com/cabinet/acte/
│   │   │   ├── config/             # Configuration (CORS, etc.)
│   │   │   ├── controller/         # REST Controllers
│   │   │   ├── service/            # Business Logic
│   │   │   ├── repository/         # Data Access
│   │   │   ├── entity/             # JPA Entities
│   │   │   ├── dto/                # Data Transfer Objects
│   │   │   ├── exception/          # Exception Handling
│   │   │   └── CabinetActeApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       └── application-prod.properties
│   ├── pom.xml
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/             # Vue Components
│   │   ├── services/               # API Services
│   │   ├── views/                  # Page Views
│   │   ├── App.vue
│   │   └── main.js
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.local
│
├── docs/
│   ├── API.md                      # API Documentation
│   ├── SETUP.md                    # Setup Guide
│   └── DATABASE.md                 # Database Schema
│
├── README.md
├── .gitignore
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
# Cloner le repository
git clone https://github.com/koudousse-ab/Cabinet-ACTe.git
cd Cabinet-ACTe/backend

# Installer les dépendances
mvn clean install

# Configurer la base de données
# Voir SETUP.md pour les instructions PostgreSQL

# Lancer l'application
mvn spring-boot:run
```

L'API sera disponible sur: `http://localhost:8080`

### Installation Frontend

```bash
cd ../frontend

# Installer les dépendances
npm install

# Créer le fichier .env.local
echo 'VITE_API_URL=http://localhost:8080/api/v1' > .env.local

# Lancer le serveur de développement
npm run dev
```

L'interface sera disponible sur: `http://localhost:5173`

---

## 📚 Documentation

- **[SETUP.md](./docs/SETUP.md)** - Guide d'installation détaillé
- **[API.md](./docs/API.md)** - Documentation complète de l'API REST
- **[DATABASE.md](./docs/DATABASE.md)** - Schéma et structure de la base de données
- **[README_TASKS.md](./README_TASKS.md)** - Documentation du module Tâches

---

## 🔌 API Endpoints (Module Tâches)

### Create
```http
POST /api/v1/tasks
Content-Type: application/json

{
  "title": "Tâche 1",
  "description": "Description",
  "status": "TODO",
  "priority": "HIGH",
  "projectId": 1
}
```

### Read
```http
GET /api/v1/tasks              # Récupérer toutes les tâches
GET /api/v1/tasks/{id}         # Récupérer une tâche
GET /api/v1/tasks/project/{id} # Récupérer par projet
GET /api/v1/tasks/status/{status} # Récupérer par statut
```

### Update
```http
PUT /api/v1/tasks/{id}
PATCH /api/v1/tasks/{id}/status/{status}
```

### Delete
```http
DELETE /api/v1/tasks/{id}
```

Pour tous les endpoints, voir **[API.md](./docs/API.md)**

---

## 🧪 Tests

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm run test
```

---

## 📦 Build & Deployment

### Backend (JAR)
```bash
cd backend
mvn clean package -DskipTests
# JAR sera dans: target/cabinet-acte-1.0.0.jar
```

### Frontend (Production)
```bash
cd frontend
npm run build
# Build sera dans: dist/
```

---

## 🤝 Contribution

Les contributions sont les bienvenues! Voir [CONTRIBUTING.md](./CONTRIBUTING.md)

### Workflow
1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

---

## 📋 Roadmap

- [x] Module Tâches
- [ ] Module Projets
- [ ] Module Employés
- [ ] Dashboard
- [ ] Calendrier
- [ ] Rapports
- [ ] Authentification
- [ ] Notifications
- [ ] Mobile App

---

## 📞 Support

Pour les questions ou problèmes:
- Créer une [Issue](https://github.com/koudousse-ab/Cabinet-ACTe/issues)
- Consulter la [Documentation](./docs/)
- Contacter: koudousetchedre@gmail.com

---

## 📄 License

Copyright © 2026 Cabinet ACTe. Tous droits réservés.

---

## 👨‍💻 Auteurs

- **TCHEDRE Koudousse** - Gestion des projets + Tableau de bord
- **DJAGBARE Davide Damtaré** - Gestion des tâches + Calendrier automatisé
- **PAKPALI Giles Essoyota** - Gestion des employés, suivi des activités, erreurs, rapports hebdomadaires
- **Cabinet ACTe Team**

---

**Made with ❤️ by Cabinet ACTe**
