# Deploy Rápido en Railway - 5 Minutos

## Opción 1: Deploy Automático (Recomendado)

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/agrolara/Manusfichero.git
cd Manusfichero
```

### Paso 2: Ejecutar Script de Deploy
```bash
bash scripts/deploy-railway.sh
```

El script hará todo automáticamente:
- Instala Railway CLI
- Te pide iniciar sesión
- Crea un nuevo proyecto
- Te guía para agregar variables de entorno
- Despliega la app

### Paso 3: Acceder a la App
Después de que termine, ejecuta:
```bash
railway status
```

Verás la URL pública. Abre en tu navegador y ¡listo!

---

## Opción 2: Deploy Manual (Si prefieres control total)

### Paso 1: Crear Cuenta en Railway
1. Ve a https://railway.app
2. Haz clic en **Sign Up**
3. Usa GitHub para registrarte

### Paso 2: Crear Nuevo Proyecto
1. En el dashboard, haz clic en **New Project**
2. Selecciona **Deploy from GitHub repo**
3. Busca `agrolara/Manusfichero`
4. Haz clic en **Deploy**

### Paso 3: Configurar Variables
1. En tu proyecto, ve a **Variables**
2. Agrega:
   - `SUPABASE_URL` = Tu URL de Supabase
   - `SUPABASE_ANON_KEY` = Tu clave de Supabase
   - `NODE_ENV` = `production`
   - `PORT` = `3000`

### Paso 4: Esperar Deploy
1. Ve a **Deployments**
2. Espera a que termine (verde)
3. Copia la URL pública

### Paso 5: Acceder
Abre la URL en tu navegador:
```
https://your-app.up.railway.app
```

**Credenciales:**
- Email: `agro_lara@yahoo.com`
- Contraseña: `12345678`

---

## Verificar que Todo Funciona

1. **Inicia sesión** con las credenciales
2. **Agrega un móvil** (ej: 101)
3. **Asigna una carrera** con monto (ej: 150)
4. **Verifica en Supabase** que los datos estén sincronizados
5. **Recarga la página** para verificar que los datos persisten

---

## Troubleshooting

### "Build failed"
```bash
# Prueba localmente
pnpm install
pnpm build
```

### "App crashes"
- Verifica las variables de entorno en Railway
- Revisa los logs: `railway logs`

### "Can't login"
- Verifica que Supabase esté accesible
- Comprueba SUPABASE_URL y SUPABASE_ANON_KEY

---

## Actualizar la App

Cada vez que hagas cambios:
```bash
git add .
git commit -m "Descripción"
git push origin main
```

Railway automáticamente redeploy la nueva versión.

---

## Soporte

- Railway Docs: https://docs.railway.app
- GitHub Issues: https://github.com/agrolara/Manusfichero/issues
- Supabase Docs: https://supabase.com/docs
