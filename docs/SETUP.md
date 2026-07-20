# Setup Guide - Cabinet ACTe MissionFlow 🚀

## Table des Matières
1. [Prérequis](#prérequis)
2. [Installation Backend](#installation-backend)
3. [Installation Frontend](#installation-frontend)
4. [Configuration Base de Données](#configuration-base-de-données)
5. [Lancer l'application](#lancer-lapplication)
6. [Dépannage](#dépannage)

---

## Prérequis

### Système
- **OS**: Windows, macOS, ou Linux
- **RAM**: 4GB minimum
- **Disque**: 2GB minimum

### Logiciels requis

#### 1. Java 17+
```bash
# Vérifier la version
java -version

# Télécharger depuis: https://www.oracle.com/java/technologies/downloads/
# Ou via homebrew (macOS)
brew install java@17
```

#### 2. Maven 3.6+
```bash
# Vérifier la version
mvn -version

# Télécharger depuis: https://maven.apache.org/download.cgi
# Ou via homebrew (macOS)
brew install maven
```

#### 3. Node.js 16+ et npm
```bash
# Vérifier les versions
node --version
npm --version

# Télécharger depuis: https://nodejs.org/
# Ou via homebrew (macOS)
brew install node
```

#### 4. PostgreSQL 14+
```bash
# Vérifier la version
psql --version

# Télécharger depuis: https://www.postgresql.org/download/
# Ou via homebrew (macOS)
brew install postgresql
```

#### 5. pgAdmin (optionnel mais recommandé)
```bash
# Télécharger depuis: https://www.pgadmin.org/download/
# Interface web pour gérer PostgreSQL
```

#### 6. Git
```bash
# Vérifier
git --version

# Télécharger depuis: https://git-scm.com/
```

---

## Installation Backend

### Étape 1: Cloner le repository

```bash
git clone https://github.com/koudousse-ab/Cabinet-ACTe.git
cd Cabinet-ACTe/backend
```

### Étape 2: Configurer la base de données

Voir la section [Configuration Base de Données](#configuration-base-de-données) ci-dessous.

### Étape 3: Mettre à jour application.properties

Modifier `src/main/resources/application.properties`:

```properties
# Database credentials
spring.datasource.url=jdbc:postgresql://localhost:5432/mission_flow
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

### Étape 4: Installer les dépendances Maven

```bash
mvn clean install
```

Cela téléchargera toutes les dépendances.

### Étape 5: Vérifier l'installation

```bash
mvn -version
mvn help:describe -Dplugin=org.springframework.boot:spring-boot-maven-plugin
```

---

## Installation Frontend

### Étape 1: Naviguer vers le dossier frontend

```bash
cd ../frontend
```

### Étape 2: Créer .env.local

```bash
echo 'VITE_API_URL=http://localhost:8080/api/v1' > .env.local
```

Ou créer manuellement le fichier:
```
frontend/.env.local
```

Avec le contenu:
```env
VITE_API_URL=http://localhost:8080/api/v1
```

### Étape 3: Installer les dépendances npm

```bash
npm install
```

Ou avec yarn:
```bash
yarn install
```

### Étape 4: Vérifier l'installation

```bash
node --version
npm --version
```

---

## Configuration Base de Données

### Créer la base de données PostgreSQL

#### Via pgAdmin (Interface graphique)

1. Ouvrir pgAdmin: `http://localhost:5050`
2. Se connecter (défaut: postgres / postgres)
3. Clic droit sur **Databases** → **Create** → **Database**
4. Nom: `mission_flow`
5. Cliquer **Save**

#### Via ligne de commande

```bash
psql -U postgres -c "CREATE DATABASE mission_flow;"
```

### Créer les tables

1. Ouvrir pgAdmin et aller dans la DB `mission_flow`
2. Tools → Query Tool
3. Copier-coller le script SQL (voir fichier `database.sql`)
4. Exécuter (F5)

#### Ou via commande:

```bash
psql -U postgres -d mission_flow -f database.sql
```

### Vérifier la création

```bash
psql -U postgres -d mission_flow -c "\dt acte.*"
```

Doit afficher:
```
          List of relations
Schema | Name  | Type  | Owner
--------+-------+-------+----------
acte   | task  | table | postgres
acte   | project | table | postgres
acte   | employee | table | postgres
```

---

## Lancer l'application

### Terminal 1: Lancer le Backend

```bash
cd backend
mvn spring-boot:run
```

Vous devriez voir:
```
2026-07-18 12:00:00.000  INFO 1234 --- [...] : Started CabinetActeApplication
```

✅ Backend prêt sur: `http://localhost:8080`

### Terminal 2: Lancer le Frontend

```bash
cd frontend
npm run dev
```

Vous devriez voir:
```
LOCAL:   http://localhost:5173/
```

✅ Frontend prêt sur: `http://localhost:5173`

### Vérifier que tout fonctionne

**Test 1: Accéder au frontend**
```
http://localhost:5173
```

**Test 2: Tester l'API**
```bash
curl http://localhost:8080/api/v1/tasks
```

Doit retourner les tâches en JSON.

---

## Dépannage

### Backend ne démarre pas

#### Erreur: Port 8080 déjà utilisé
```bash
# Trouver le processus
lsof -i :8080

# Arrêter le processus
kill -9 <PID>

# Ou changer le port dans application.properties
server.port=8081
```

#### Erreur: Base de données non trouvée
```bash
# Vérifier PostgreSQL
psql -U postgres

# Vérifier la connexion
psql -U postgres -h localhost -d mission_flow
```

#### Erreur: Dépendances Maven
```bash
# Supprimer le cache et réinstaller
rm -rf ~/.m2/repository
mvn clean install
```

### Frontend ne démarre pas

#### Erreur: Port 5173 déjà utilisé
```bash
# Lancer sur un autre port
npm run dev -- --port 5174
```

#### Erreur: node_modules corrompu
```bash
# Supprimer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

#### Erreur: CORS
```
Access to XMLHttpRequest blocked by CORS policy
```

Assurez-vous que le backend a CORS configuré (voir `CorsConfig.java`).

### Erreur: Connexion API refusée

```bash
# Vérifier que le backend est lancé
curl http://localhost:8080/api/v1/tasks

# Vérifier le .env.local
cat frontend/.env.local

# Redémarrer le frontend
Ctrl+C
npm run dev
```

### PostgreSQL ne démarre pas

```bash
# Sur macOS
brew services start postgresql

# Sur Linux
sudo systemctl start postgresql

# Vérifier le statut
pg_isready
```

---

## Configuration par Environnement

### Development
```bash
# Backend
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Frontend
npm run dev
```

### Production
```bash
# Backend
mvn clean package -DskipTests
java -jar target/cabinet-acte-1.0.0.jar --spring.profiles.active=prod

# Frontend
npm run build
# Servir avec: npm run preview
```

---

## Commandes Utiles

### Backend
```bash
# Tests
mvn test

# Build JAR
mvn clean package

# Nettoyer
mvn clean

# Voir les dépendances
mvn dependency:tree
```

### Frontend
```bash
# Build production
npm run build

# Vérifier la qualité du code
npm run lint

# Prévisualiser le build
npm run preview

# Nettoyer
rm -rf dist node_modules
```

---

## Ressources Utiles

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Vue.js Docs](https://vuejs.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Maven Docs](https://maven.apache.org/)
- [Vite Docs](https://vitejs.dev/)

---

## Support

Si vous rencontrez des problèmes:
1. Vérifier cette documentation
2. Créer une [Issue](https://github.com/koudousse-ab/Cabinet-ACTe/issues)
3. Contacter: koudousetchedre@gmail.com

---

**Bonne installation! 🚀**
