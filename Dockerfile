# Etapa 1: Construcción (Empaquetar la aplicación)
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Compilamos el proyecto y saltamos las pruebas para que sea más rápido
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución (Correr la aplicación)
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Copiamos el archivo .jar generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar
# Exponemos el puerto estándar de Spring Boot
EXPOSE 8080
# Comando para encender el servidor
ENTRYPOINT ["java", "-jar", "app.jar"]