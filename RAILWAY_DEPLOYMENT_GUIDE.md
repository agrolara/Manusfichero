# 🚀 Full Express - Guía Completa de Deploy en Railway

## 📋 Requisitos Previos

- ✅ Cuenta en Railway (https://railway.app)
- ✅ Cuenta en GitHub (para conectar el repositorio)
- ✅ Proyecto Supabase creado con credenciales
- ✅ Aplicación Full Express completamente funcional

---

## 🔑 Credenciales de Supabase Necesarias

Antes de desplegar, necesitarás tener a mano:

1. **SUPABASE_URL**: Tu URL de proyecto Supabase
   - Formato: `https://xxxxx.supabase.co`
   - Encontrar en: Dashboard Supabase → Settings → API

2. **SUPABASE_ANON_KEY**: Tu clave anónima de Supabase
   - Encontrar en: Dashboard Supabase → Settings → API → anon public

3. **USUARIO ADMINISTRADOR**:
   - Email: `agro_lara@yahoo.com`
   - Contraseña: `12345678`

---

## 📱 Paso 1: Preparar el Repositorio

### Si aún no has hecho push a GitHub:

```bash
cd /home/ubuntu/full_express_taxi

# Inicializar git (si no está)
git init

# Agregar todos los cambios
git add .

# Hacer commit
git commit -m "Full Express v2.0 - Sistema de gestión de taxis con Supabase"

# Agregar remote (reemplaza con tu repositorio)
git remote add origin https://github.com/agrolara/Manusfichero.git

# Push a main
git branch -M main
git push -u origin main
```

### Si ya tienes el repositorio:

```bash
cd /home/ubuntu/full_express_taxi
git add .
git commit -m "Full Express actualizado - botón Admin y sincronización"
git push
```

---

## 🚀 Paso 2: Deploy en Railway

### Opción A: Desde la Interfaz de Manus (Recomendado)

1. **En el panel de Management UI de Manus:**
   - Haz clic en el botón **"Publish"** (esquina superior derecha)
   - Selecciona **"Railway"** como plataforma
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `agrolara/Manusfichero`
   - Configura las variables de entorno (ver Paso 3)
   - Inicia el deploy

### Opción B: Desde Railway Directamente

1. **Ir a https://railway.app**
2. **Crear nuevo proyecto:**
   - Haz clic en "New Project"
   - Selecciona "Deploy from GitHub"
   - Conecta tu cuenta de GitHub
   - Selecciona `agrolara/Manusfichero`
3. **Configurar variables de entorno** (ver Paso 3)
4. **Desplegar**

---

## 🔧 Paso 3: Configurar Variables de Entorno

En Railway, ve a **Settings** → **Variables** y agrega:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | URL de tu proyecto Supabase |
| `SUPABASE_ANON_KEY` | `eyJhbGc...` | Clave anónima de Supabase |
| `NODE_ENV` | `production` | Entorno de producción |
| `PORT` | `3000` | Puerto de la aplicación |

---

## ✅ Paso 4: Verificar el Deploy

Una vez que Railway termine el deploy (5-10 minutos):

1. **Obtener la URL:**
   - En Railway, ve a tu proyecto
   - Copia la URL pública (ej: `https://full-express.up.railway.app`)

2. **Probar la aplicación:**
   - Abre la URL en tu navegador
   - Deberías ver la pantalla de login de Full Express
   - Inicia sesión con: `agro_lara@yahoo.com` / `12345678`

3. **Verificar funcionalidades:**
   - ✅ Botones Stat, Rep, Admin, Salir visibles
   - ✅ Puedes ingresar móviles
   - ✅ Puedes asignar carreras
   - ✅ Datos se sincronizan en Supabase

---

## 🔄 Paso 5: Probar Sincronización en Tiempo Real

### Desde múltiples dispositivos:

1. **Dispositivo 1:**
   - Abre la URL en navegador
   - Inicia sesión
   - Ingresa móvil `101`

2. **Dispositivo 2:**
   - Abre la misma URL en otro navegador/dispositivo
   - Inicia sesión
   - Deberías ver el móvil `101` apareciendo en las colas

3. **Verificar sincronización:**
   - Asigna una carrera en Dispositivo 1
   - Debería aparecer en Dispositivo 2 al instante
   - Los montos y totales se actualizan en ambos

---

## 👥 Paso 6: Crear Más Usuarios

1. **Inicia sesión como administrador** (agro_lara@yahoo.com)
2. **Haz clic en botón "Admin"** (púrpura)
3. **Ingresa datos del nuevo usuario:**
   - Email: `supervisor@example.com`
   - Contraseña: `password123` (mínimo 8 caracteres)
4. **Haz clic en "Crear Usuario"**
5. **El nuevo usuario puede iniciar sesión inmediatamente**

---

## 📊 Paso 7: Usar la Aplicación

### Funcionalidades principales:

**Ingreso de Móviles:**
- Escribe ID del móvil (ej: 101)
- Presiona Enter o haz clic en +

**Asignar Carrera:**
- Haz clic en "OK" en el móvil
- Ingresa el monto
- Presiona Enter o "Guardar"

**Ceder Turno:**
- Haz clic en "Cede" en el móvil
- El móvil mantiene posición hasta la 3ª vez
- En la 3ª vez, pasa al final de la cola

**Ver Historial:**
- Haz clic en "H" en el móvil
- Puedes editar (E) o eliminar (X) registros

**Reportes:**
- Haz clic en "Rep" en el header
- Selecciona un día o mes
- Haz clic en "Exportar PDF"

**Estadísticas:**
- Haz clic en "Stat" en el header
- Ver totales por móvil y por tipo

---

## 🔍 Troubleshooting

### "Build failed en Railway"
```
Solución:
1. Verifica que pnpm-lock.yaml esté en el repositorio
2. Asegúrate de que package.json sea válido
3. Intenta hacer push nuevamente
```

### "Can't login"
```
Solución:
1. Verifica que SUPABASE_URL sea correcto
2. Verifica que SUPABASE_ANON_KEY sea correcto
3. Revisa los logs en Railway → Deployments → View Logs
```

### "Data not syncing"
```
Solución:
1. Verifica que estés autenticado
2. Abre la consola del navegador (F12)
3. Busca errores de conexión a Supabase
4. Verifica que las tablas existan en Supabase
```

### "App crashes"
```
Solución:
1. Ve a Railway → Deployments → View Logs
2. Busca errores en los logs
3. Verifica las variables de entorno
4. Intenta hacer un nuevo deploy
```

---

## 📈 Monitoreo y Mantenimiento

### Ver logs en tiempo real:
```
En Railway → Tu proyecto → Deployments → View Logs
```

### Actualizar la aplicación:
```bash
# Hacer cambios localmente
git add .
git commit -m "Descripción de cambios"
git push

# Railway automáticamente detectará los cambios y hará redeploy
```

### Escalar recursos:
```
En Railway → Settings → Plan
Puedes aumentar CPU y memoria si es necesario
```

---

## 🎯 Checklist Final

- [ ] Repositorio en GitHub actualizado
- [ ] Variables de Supabase configuradas en Railway
- [ ] Deploy completado sin errores
- [ ] Login funciona con credenciales admin
- [ ] Botón Admin visible después de login
- [ ] Puedo ingresar móviles
- [ ] Puedo asignar carreras
- [ ] Datos se sincronizan en tiempo real
- [ ] Reportes se pueden exportar a PDF
- [ ] Múltiples usuarios pueden acceder simultáneamente

---

## 📞 Soporte

- **GitHub Issues:** https://github.com/agrolara/Manusfichero/issues
- **Railway Support:** https://railway.app/support
- **Supabase Docs:** https://supabase.com/docs

---

## ✨ ¡Listo!

Tu aplicación **Full Express** está en la nube y accesible desde cualquier dispositivo.

**URL de acceso:** `https://your-app-name.up.railway.app`

**Todos los usuarios pueden:**
- ✅ Acceder desde cualquier dispositivo
- ✅ Ver datos en tiempo real
- ✅ Ingresar móviles y carreras
- ✅ Generar reportes
- ✅ Colaborar simultáneamente

---

**Última actualización:** Enero 2026
**Versión:** 2.0.0 (Producción)
**Estado:** ✅ Listo para producción
