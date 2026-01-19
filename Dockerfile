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

# Comando para iniciar (ejecutar directamente el archivo JS compilado)
CMD ["node", "--input-type=module", "dist/index.js"]
