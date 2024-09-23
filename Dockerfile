# Usa la imagen base de Node.js
FROM node:20-alpine3.19

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación al contenedor
COPY . .

# Compila la app de TypeScript a JavaScript
RUN npm run build

# Expone el puerto que usará la app
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "run", "start:prod"]
