# -------- STAGE 1: BUILD --------
FROM eclipse-temurin:17-jdk AS build

WORKDIR /build
COPY . .
RUN chmod +x gradlew && ./gradlew clean bootJar -x test

# -------- STAGE 2: RUNTIME --------
FROM eclipse-temurin:17-jre

WORKDIR /app
COPY --from=build /build/build/libs/*[^plain].jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
