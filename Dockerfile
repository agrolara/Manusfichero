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

# Build web frontend
RUN pnpm exec expo export --platform web --output-dir web-dist

# Production stage
FROM node:18-alpine

WORKDIR /app

# Instalar pnpm y http-server para servir archivos estáticos
RUN npm install -g pnpm http-server

# Copiar package.json para instalar dependencias de producción
COPY package.json pnpm-lock.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --frozen-lockfile --prod

# Copiar backend compilado
COPY --from=builder /app/dist ./dist

# Copiar frontend compilado
COPY --from=builder /app/web-dist ./web-dist

# Crear script de inicio que sirva ambos
RUN cat > /app/start.sh << 'EOF'
#!/bin/sh
# Iniciar backend en puerto 3000
node dist/index.js &
BACKEND_PID=$!

# Iniciar servidor web en puerto 8080 (será redirigido a 3000 por Railway)
cd /app/web-dist
http-server -p 8080 -c-1

wait $BACKEND_PID
EOF

RUN chmod +x /app/start.sh

# Exponer puerto
EXPOSE 3000

# Comando para iniciar
CMD ["/app/start.sh"]
