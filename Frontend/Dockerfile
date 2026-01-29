# Etapa 1: Construcción del frontend con Node.js
FROM node:20-alpine AS builder

WORKDIR /app

# Definimos los argumentos que vienen desde el comando docker build
ARG VITE_API_URL
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID

# Los convertimos en variables de entorno para que Vite los vea
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID

# Copia los archivos de dependencias desde la subcarpeta toolrent/
COPY toolrent/package*.json ./

# Instala las dependencias
RUN npm ci

# Copia el resto del código fuente desde la subcarpeta toolrent/
COPY toolrent/. .

# Compila la aplicación (genera la carpeta dist)
RUN npm run build

# Etapa 2: Imagen ligera de Nginx para servir los archivos estáticos
FROM nginx:stable-alpine

# Copia el resultado del build (dist/) al directorio por defecto de Nginx
COPY --from=builder /app/dist/ /usr/share/nginx/html

# Exponer el puerto 80 para servir la web
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
