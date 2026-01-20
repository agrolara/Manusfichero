# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY pnpm-lock.yaml package.json ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Build backend
RUN pnpm build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package.json para instalar dependencias de producción
COPY package.json pnpm-lock.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --frozen-lockfile --prod

# Copiar backend compilado
COPY --from=builder /app/dist ./dist

# Copiar archivos web
COPY web-app/index.html ./public/
COPY web-app/server-web.js ./

# Crear script de inicio que sirva ambos
RUN cat > /app/start.sh << 'EOF'
#!/bin/sh
# Iniciar backend API en puerto 3000
node dist/index.js &
BACKEND_PID=$!

# Iniciar servidor web en puerto 8080 (será redirigido a 3000 por Railway)
node server-web.js

wait $BACKEND_PID
EOF

RUN chmod +x /app/start.sh

# Exponer puerto
EXPOSE 3000

# Comando para iniciar
CMD ["/app/start.sh"]
