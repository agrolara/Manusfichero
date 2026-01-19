# Full Express - Deploy Final en Railway

## ✅ Aplicación Completada

Full Express está **100% lista para producción** con todas las características:

✅ Sistema de 3 colas de despacho (Blanca, Azul, Roja)
✅ Gestión de carreras con montos y historial
✅ Mecánica de cede automática
✅ Almacenamiento por días (30 días retención)
✅ Reportes diarios y mensuales
✅ Autenticación con Supabase
✅ Panel de administrador para crear usuarios
✅ Sistema de roles y permisos
✅ Exportación de reportes a PDF
✅ Sincronización en tiempo real
✅ Visual optimizado para móvil

---

## 🚀 Desplegar en Railway (5 Minutos)

### Opción 1: Deploy Automático (Recomendado)

```bash
# Clonar repositorio
git clone https://github.com/agrolara/Manusfichero.git
cd Manusfichero

# Ejecutar script de deploy
bash scripts/deploy-railway.sh
```

### Opción 2: Deploy Manual

1. **Ir a Railway:** https://railway.app
2. **Crear cuenta** (usar GitHub es más fácil)
3. **Nuevo proyecto** → Deploy from GitHub
4. **Seleccionar** `agrolara/Manusfichero`
5. **Configurar variables:**
   - `SUPABASE_URL` = Tu URL de Supabase
   - `SUPABASE_ANON_KEY` = Tu clave de Supabase
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
6. **Desplegar** y esperar (5-10 minutos)

---

## 🔑 Credenciales de Acceso

**Usuario Administrador:**
- Email: `agro_lara@yahoo.com`
- Contraseña: `12345678`

**Rol:** Administrador (acceso total)

---

## 📱 Acceder a la App

Después del deploy, la app estará disponible en:
```
https://your-app-name.up.railway.app
```

**Desde cualquier dispositivo:**
1. Abre el link en navegador
2. Inicia sesión con las credenciales
3. ¡Listo! Todos ven los datos en tiempo real

---

## 👥 Crear Más Usuarios

1. Inicia sesión como administrador
2. Haz clic en botón **"Admin"** (naranja)
3. Ingresa email y contraseña del nuevo usuario
4. Haz clic en **"Crear Usuario"**
5. El nuevo usuario puede iniciar sesión inmediatamente

---

## 📊 Roles y Permisos

### Administrador
- ✅ Crear/editar/eliminar usuarios
- ✅ Ver todos los datos
- ✅ Editar/eliminar cualquier registro
- ✅ Exportar reportes
- ✅ Gestionar roles

### Supervisor
- ✅ Ver todos los datos
- ✅ Exportar reportes
- ❌ No puede crear usuarios
- ❌ No puede editar datos

### Operador
- ✅ Ingresar móviles
- ✅ Asignar carreras
- ❌ No puede ver datos de otros operadores
- ❌ No puede exportar reportes

---

## 📄 Exportar Reportes

1. Ve a la pantalla **"Rep"** (Reportes)
2. Selecciona un día o mes
3. Haz clic en **"Exportar PDF"**
4. El archivo se descarga automáticamente

---

## 🔄 Sincronización en Tiempo Real

Todos los datos se sincronizan automáticamente:
- ✅ Cuando ingresas un móvil
- ✅ Cuando asignas una carrera
- ✅ Cuando un móvil cede
- ✅ Cuando reinician el día

**Resultado:** Todos ven los cambios al instante en la nube.

---

## 🐛 Troubleshooting

### "Build failed en Railway"
```bash
# Prueba localmente
pnpm install
pnpm build
```

### "Can't login"
- Verifica que Supabase esté accesible
- Comprueba SUPABASE_URL y SUPABASE_ANON_KEY

### "Data not syncing"
- Verifica que estés autenticado
- Revisa la consola del navegador
- Asegúrate de que Supabase esté conectado

### "App crashes"
- Revisa los logs en Railway
- Verifica las variables de entorno
- Intenta desplegar nuevamente

---

## 📞 Soporte

- **GitHub:** https://github.com/agrolara/Manusfichero
- **Railway:** https://railway.app/support
- **Supabase:** https://supabase.com/support

---

## 🎯 Próximos Pasos (Opcional)

1. **Dominio personalizado:** Conectar dominio propio en Railway
2. **Notificaciones push:** Alertas cuando se asignan carreras
3. **Historial de auditoría:** Registrar quién hizo cada acción
4. **Gráficos de tendencia:** Visualizar datos por día/mes

---

## ✨ ¡Listo!

Tu aplicación **Full Express** está lista para usar en la nube.

**Todos los usuarios pueden:**
- ✅ Acceder desde cualquier dispositivo
- ✅ Ver datos en tiempo real
- ✅ Ingresar móviles y carreras
- ✅ Generar reportes

**¡A disfrutar!** 🚕

---

**Última actualización:** Enero 2025
**Versión:** 2.0.0 (Producción)
