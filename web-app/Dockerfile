FROM node:18-alpine

WORKDIR /app

# Instalar express para servir archivos estáticos
RUN npm install express

# Copiar archivos web
COPY index.html ./public/
COPY server.js ./

# Exponer puerto
EXPOSE 3000

# Comando para iniciar
CMD ["node", "server.js"]
