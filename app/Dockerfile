# 1. Usa una imagen base oficial de Node.js (versión ligera)
FROM node:18-alpine

# 2. Crea y se mueve a una carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copia los archivos de configuración de dependencias
COPY package*.json ./

# 4. Instala las dependencias (sin las de desarrollo para que sea más ligero)
RUN npm install --omit=dev

# 5. Copia el resto del código de tu aplicación
COPY . .

# 6. Le dice a Docker que este contenedor usará el puerto 3000
EXPOSE 3000

# 7. El comando que se ejecuta cuando el contenedor arranca
CMD ["node", "server.js"]