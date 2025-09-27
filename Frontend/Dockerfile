# Etapa 1: Construcción del frontend con Node.js
FROM node:18-alpine AS builder

WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm ci

# Copia el resto del código fuente
COPY . .

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