#!/bin/sh
set -e
# Render fournit host/port/nom de base séparément (pas d'URL JDBC toute faite).
# On construit ici l'URL JDBC attendue par Spring Boot : jdbc:postgresql://host:port/db
if [ -n "$DB_HOST" ]; then
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT:-5432}/${DB_NAME}?sslmode=require&channelBinding=disable"
fi

# Limite mémoire JVM pour respecter le plan Free Render (512Mi max)
exec java -Xmx400m -Xss256k -XX:MaxMetaspaceSize=100m -jar app.jar
