# ─── Étape 1 : build Maven ───
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Télécharge les dépendances séparément pour profiter du cache Docker
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# ─── Étape 2 : image d'exécution légère ───
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render fournit le port via la variable d'environnement PORT
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
