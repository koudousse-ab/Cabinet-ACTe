# =====================================================
# Dockerfile — Backend Spring Boot (Cabinet ACTe / MissionFlow)
# Build multi-stage : image de build Maven + image runtime JRE 17
# Conçu pour Render (runtime: docker, dockerContext: ./backend)
# =====================================================

# ─── Étape 1 : BUILD (compilation du jar) ───
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copie du pom.xml seul pour profiter du cache des dépendances Maven
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copie du code source puis compilation (tests désactivés pour un build plus rapide)
COPY src ./src
RUN mvn clean package -DskipTests -B

# ─── Étape 2 : RUNTIME (image finale légère) ───
FROM eclipse-temurin:17-jre
WORKDIR /app

# Utilisateur non-root par sécurité
RUN groupadd -r app && useradd -r -g app app

# Copie du jar construit à l'étape précédente
COPY --from=build /app/target/*.jar app.jar

# Copie du script d'entrée qui construit l'URL JDBC depuis les variables Render
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

USER app

EXPOSE 8080

ENTRYPOINT ["/app/docker-entrypoint.sh"]
