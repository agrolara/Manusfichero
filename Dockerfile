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

# Exponer puerto
EXPOSE 3000

# Comando para iniciar
CMD ["node", "dist/index.js"]
