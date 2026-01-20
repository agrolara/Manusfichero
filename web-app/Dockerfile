FROM node:18-alpine

WORKDIR /app

# Copiar archivos web
COPY index.html ./
COPY server.js ./

# Exponer puerto
EXPOSE 3000

# Comando para iniciar
CMD ["node", "server.js"]
