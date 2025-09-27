# 1. Imagen base
# Empezamos con una imagen ligera de Nginx.
FROM nginx:stable-alpine

# 2. Copiar los archivos compilados
# Copia el contenido de tu carpeta local 'dist' al directorio
# por defecto de Nginx dentro del contenedor.
COPY dist/ /usr/share/nginx/html

# 3. Exponer el puerto
# Informa a Docker que el contenedor escuchará en el puerto 80.
EXPOSE 80

# 4. Comando de inicio
# Inicia Nginx en primer plano para mantener el contenedor activo.
CMD ["nginx", "-g", "daemon off;"]
