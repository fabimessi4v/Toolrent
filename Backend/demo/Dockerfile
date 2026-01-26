# Usa la imagen oficial de OpenJDK como base
FROM eclipse-temurin:17-jre

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el JAR generado al contenedor (mismo nivel que Dockerfile)
COPY build/libs/*.jar toolrent-backend.jar
# Expone el puerto (por ejemplo, 8080)
EXPOSE 8080

# Comando para ejecutar la app
ENTRYPOINT ["java", "-jar", "toolrent-backend.jar"]
