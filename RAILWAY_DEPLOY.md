# Deploy en Railway - Full Express

Esta guía explica cómo desplegar Full Express en Railway (servidor en la nube gratuito).

## Paso 1: Crear Cuenta en Railway

1. Ve a https://railway.app
2. Haz clic en **Sign Up**
3. Usa GitHub para registrarte (más fácil)
4. Autoriza Railway a acceder a tu GitHub

## Paso 2: Crear Nuevo Proyecto

1. En el dashboard de Railway, haz clic en **New Project**
2. Selecciona **Deploy from GitHub repo**
3. Busca y selecciona `agrolara/Manusfichero`
4. Haz clic en **Deploy**

Railway automáticamente:
- Detectará el Dockerfile
- Construirá la imagen
- Desplegará la app

## Paso 3: Configurar Variables de Entorno

1. En tu proyecto Railway, ve a la pestaña **Variables**
2. Agrega las siguientes variables:

| Variable | Valor |
|----------|-------|
| `SUPABASE_URL` | Tu URL de Supabase (ej: `https://xxxxx.supabase.co`) |
| `SUPABASE_ANON_KEY` | Tu clave anónima de Supabase |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

3. Haz clic en **Deploy** nuevamente para aplicar los cambios

## Paso 4: Obtener URL Pública

1. En tu proyecto Railway, ve a la pestaña **Deployments**
2. Espera a que el deploy termine (verde)
3. Haz clic en **View Logs** para ver si hay errores
4. En la pestaña **Settings**, encontrarás la URL pública (ej: `https://full-express-production.up.railway.app`)

## Paso 5: Acceder a la App

Abre la URL pública en tu navegador:
```
https://full-express-production.up.railway.app
```

**Credenciales:**
- Email: `agro_lara@yahoo.com`
- Contraseña: `12345678`

## Paso 6: Verificar Sincronización

1. Inicia sesión en la app
2. Agrega un móvil (ej: 101)
3. Asigna una carrera con monto (ej: 150)
4. Ve a Supabase Dashboard y verifica que los datos estén en la tabla `daily_data`

## Actualizar la App

Cada vez que hagas cambios:

```bash
# En tu computadora
git add .
git commit -m "Descripción de cambios"
git push origin main
```

Railway automáticamente:
1. Detecta el push
2. Reconstruye la imagen
3. Despliega la nueva versión

## Troubleshooting

### "Build failed"
- Revisa los logs en Railway
- Verifica que `pnpm install` funcione localmente
- Asegúrate de que `package.json` esté correcto

### "App crashes after deploy"
- Verifica las variables de entorno en Railway
- Revisa los logs para ver el error
- Asegúrate de que SUPABASE_URL y SUPABASE_ANON_KEY sean correctos

### "Can't connect to Supabase"
- Verifica que SUPABASE_URL sea exacto (sin espacios)
- Verifica que SUPABASE_ANON_KEY sea correcta
- Prueba localmente: `SUPABASE_URL=xxx SUPABASE_ANON_KEY=yyy pnpm dev`

### "Database not syncing"
- Verifica que el usuario esté autenticado
- Revisa la consola del navegador para errores
- Verifica que Supabase esté accesible

## Más Información

- [Documentación de Railway](https://docs.railway.app)
- [Supabase Docs](https://supabase.com/docs)
- [Docker Documentation](https://docs.docker.com)

## Soporte

Si tienes problemas:
1. Revisa los logs en Railway
2. Verifica las variables de entorno
3. Intenta desplegar nuevamente
4. Contacta a soporte de Railway: https://railway.app/support
