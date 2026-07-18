# Database Schema - Cabinet ACTe MissionFlow

## Overview

La base de données utilise **PostgreSQL** avec le schéma `acte`.

---

## Tables

### 1. acte.project

Stocke les informations des projets.

```sql
CREATE TABLE acte.project (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Colonnes:**
| Nom | Type | Contrainte | Description |
|-----|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Identifiant unique |
| name | VARCHAR(255) | NOT NULL | Nom du projet |
| description | TEXT | - | Description détaillée |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'ACTIVE' | Statut du projet |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Date de création |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Date de modification |

---

### 2. acte.employee

Stocke les informations des employés.

```sql
CREATE TABLE acte.employee (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Colonnes:**
| Nom | Type | Contrainte | Description |
|-----|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Identifiant unique |
| name | VARCHAR(255) | NOT NULL | Nom complet |
| email | VARCHAR(255) | UNIQUE | Email unique |
| role | VARCHAR(50) | NOT NULL, DEFAULT 'EMPLOYEE' | Rôle de l'employé |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Date de création |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Date de modification |

---

### 3. acte.task ⭐

Stocke les informations des tâches.

```sql
CREATE TABLE acte.task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'TODO',
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    project_id INTEGER NOT NULL,
    assigned_to INTEGER,
    due_date DATE,
    estimated_hours DECIMAL(10, 2),
    actual_hours DECIMAL(10, 2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_task_project FOREIGN KEY (project_id) 
        REFERENCES acte.project(id) ON DELETE CASCADE,
    CONSTRAINT fk_task_employee FOREIGN KEY (assigned_to) 
        REFERENCES acte.employee(id) ON DELETE SET NULL,
    CONSTRAINT check_status CHECK (status IN ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'CANCELLED')),
    CONSTRAINT check_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT'))
);
```

**Colonnes:**
| Nom | Type | Contrainte | Description |
|-----|------|-----------|-------------|
| id | SERIAL | PRIMARY KEY | Identifiant unique |
| title | VARCHAR(255) | NOT NULL | Titre de la tâche |
| description | TEXT | - | Description détaillée |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'TODO', CHECK | Statut actuel |
| priority | VARCHAR(50) | NOT NULL, DEFAULT 'MEDIUM', CHECK | Niveau de priorité |
| project_id | INTEGER | NOT NULL, FK | Référence au projet (CASCADE) |
| assigned_to | INTEGER | FK | Référence à l'employé assigné (SET NULL) |
| due_date | DATE | - | Date limite |
| estimated_hours | DECIMAL(10, 2) | - | Heures estimées |
| actual_hours | DECIMAL(10, 2) | - | Heures réelles |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Date de création |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Date de modification |

---

## Indexes

Pour optimiser les requêtes:

```sql
CREATE INDEX idx_task_project_id ON acte.task(project_id);
CREATE INDEX idx_task_assigned_to ON acte.task(assigned_to);
CREATE INDEX idx_task_status ON acte.task(status);
CREATE INDEX idx_task_priority ON acte.task(priority);
CREATE INDEX idx_task_due_date ON acte.task(due_date);
CREATE INDEX idx_project_status ON acte.project(status);
CREATE INDEX idx_employee_email ON acte.employee(email);
```

---

## Relationships

### Task → Project
```
Many Tasks : One Project
Foreign Key: task.project_id → project.id
On Delete: CASCADE (supprimer les tâches quand le projet est supprimé)
```

### Task → Employee
```
Many Tasks : One Employee
Foreign Key: task.assigned_to → employee.id
On Delete: SET NULL (garder les tâches, NULL l'assignation)
```

---

## Data Types

### Statuses
- `TODO` - À faire
- `IN_PROGRESS` - En cours
- `REVIEW` - En révision
- `DONE` - Terminé
- `CANCELLED` - Annulé

### Priorities
- `LOW` - Basse
- `MEDIUM` - Moyenne
- `HIGH` - Haute
- `URGENT` - Urgente

### Employee Roles
- `ADMIN` - Administrateur
- `PROJECT_MANAGER` - Chef de projet
- `DEVELOPER` - Développeur
- `QA` - Testeur/QA
- `EMPLOYEE` - Employé standard

---

## Sample Queries

### Récupérer toutes les tâches d'un projet
```sql
SELECT t.* FROM acte.task t
WHERE t.project_id = 1
ORDER BY t.created_at DESC;
```

### Récupérer les tâches assignées à un employé
```sql
SELECT t.* FROM acte.task t
WHERE t.assigned_to = 1
AND t.status != 'DONE'
ORDER BY t.due_date ASC;
```

### Récupérer les tâches en retard
```sql
SELECT t.* FROM acte.task t
WHERE t.due_date < CURRENT_DATE
AND t.status != 'DONE'
AND t.status != 'CANCELLED'
ORDER BY t.due_date ASC;
```

### Compter les tâches par statut
```sql
SELECT 
    t.status,
    COUNT(*) as count
FROM acte.task t
GROUP BY t.status
ORDER BY count DESC;
```

### Récupérer les statistiques d'un projet
```sql
SELECT 
    p.name as project,
    COUNT(t.id) as total_tasks,
    SUM(CASE WHEN t.status = 'TODO' THEN 1 ELSE 0 END) as todo,
    SUM(CASE WHEN t.status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress,
    SUM(CASE WHEN t.status = 'DONE' THEN 1 ELSE 0 END) as done,
    SUM(CASE WHEN t.priority = 'URGENT' THEN 1 ELSE 0 END) as urgent
FROM acte.project p
LEFT JOIN acte.task t ON p.id = t.project_id
GROUP BY p.id, p.name;
```

---

## Migrations

Tous les changements de schéma doivent être documentés.

### Version 1.0.0
- Création des tables: project, employee, task
- Création des indexes pour performance
- Ajout des contraintes de clés étrangères

---

## Backup & Restore

### Backup
```bash
pg_dump -U postgres -d mission_flow -f backup.sql
```

### Restore
```bash
psql -U postgres -d mission_flow -f backup.sql
```

---

## Performance Considerations

1. **Indexes**: Utilisés sur les colonnes fréquemment interrogées
2. **Partitioning**: À considérer si la table task dépasse 1M de lignes
3. **Archiving**: Les anciennes tâches (> 1 an, DONE) peuvent être archivées
4. **Vaccum**: Run `VACUUM ANALYZE` régulièrement

---

Pour plus d'informations sur PostgreSQL, voir: https://www.postgresql.org/docs/
