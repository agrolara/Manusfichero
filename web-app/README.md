# Full Express - Versión Web Estática

Esta es una versión web estática de Full Express que se puede desplegar de forma independiente en Railway.

## Características

- ✅ Interfaz web completa de Full Express
- ✅ Sincronización automática con Supabase
- ✅ Autenticación por contraseña: `full-express`
- ✅ Sistema de 3 colas de despacho (Blanca, Azul, Roja)
- ✅ Gestión de carreras y caja
- ✅ Timezone correcto: Santiago de Chile (GMT-3)
- ✅ Acceso remoto desde cualquier dispositivo

## Deploy en Railway

### Opción 1: Desde GitHub (Recomendado)

1. Ve a [railway.app](https://railway.app)
2. Crea un nuevo proyecto
3. Conecta tu repositorio GitHub (agrolara/Manusfichero)
4. Railway detectará automáticamente el Dockerfile en la carpeta `web-app/`
5. Configura la rama a `main`
6. Haz deploy

### Opción 2: Desde Railway CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

## Variables de Entorno

No requiere variables de entorno adicionales. Las credenciales de Supabase están embebidas en el código.

## Uso

1. Accede a tu URL de Railway (ej: `https://full-express-web.railway.app`)
2. Ingresa la contraseña: `full-express`
3. ¡Listo! Comienza a usar Full Express

## Estructura

```
web-app/
├── index.html          # Interfaz web completa
├── Dockerfile          # Configuración Docker
├── railway.json        # Configuración Railway
└── README.md          # Este archivo
```

## Sincronización de Datos

- Los datos se guardan automáticamente en Supabase
- Se sincronizan cada 2 segundos
- Acceso desde múltiples dispositivos simultáneamente
- Los datos persisten incluso si la app se reinicia

## Contraseña

- **Usuario**: No requerido
- **Contraseña**: `full-express`

## Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.
