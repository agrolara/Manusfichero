FROM node:18-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY pnpm-lock.yaml package.json ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Build del servidor
RUN pnpm build

# Build de la app web (Expo)
RUN pnpm run build:web 2>/dev/null || echo "Web build skipped"

# Crear directorio para archivos estáticos si no existe
RUN mkdir -p dist/public

# Copiar archivos estáticos de la app web si existen
RUN cp -r dist/web/* dist/public/ 2>/dev/null || true

# Exponer puerto
EXPOSE 3000

# Comando para iniciar
CMD ["node", "dist/index.js"]
