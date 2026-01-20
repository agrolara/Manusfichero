FROM node:18-alpine

WORKDIR /app

# Instalar http-server para servir archivos estáticos
RUN npm install -g http-server

# Copiar archivos web
COPY index.html ./

# Exponer puerto
EXPOSE 3000

# Comando para iniciar - servir en puerto 3000
CMD ["http-server", "-p", "3000", "-c-1"]
