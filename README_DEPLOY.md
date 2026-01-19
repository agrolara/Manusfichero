# Full Express - Sistema de Gestión de Taxis

## 🚀 Desplegar en la Nube (Railway)

### ⚡ Opción Rápida (5 minutos)
```bash
git clone https://github.com/agrolara/Manusfichero.git
cd Manusfichero
bash scripts/deploy-railway.sh
```

Ver `QUICK_DEPLOY.md` para instrucciones detalladas.

### 📖 Opción Manual
Ver `RAILWAY_DEPLOY.md` para guía paso a paso.

---

## 🔑 Credenciales de Acceso

**Usuario único:**
- Email: `agro_lara@yahoo.com`
- Contraseña: `12345678`

---

## ✨ Características

✅ **Sistema de 3 colas de despacho** (Blanca, Azul, Roja)
✅ **Gestión de carreras** con montos y historial
✅ **Mecánica de cede** con contador automático
✅ **Almacenamiento por días** con retención de 30 días
✅ **Reportes diarios y mensuales**
✅ **Autenticación con Supabase**
✅ **Sincronización en la nube**
✅ **Modo de corrección** para editar/eliminar registros
✅ **Visual optimizado para móvil**

---

## 📱 Acceso Móvil

### Opción 1: Expo Go (Desarrollo)
```bash
pnpm dev
# Escanea el QR en Expo Go
```

### Opción 2: App Nativa (Producción)
```bash
eas build --platform all
```

---

## 🛠️ Desarrollo Local

### Instalar Dependencias
```bash
pnpm install
```

### Iniciar Servidor de Desarrollo
```bash
pnpm dev
```

### Compilar para Producción
```bash
pnpm build
```

### Ejecutar Tests
```bash
pnpm test
```

---

## 📊 Datos y Sincronización

### Local
- **Almacenamiento:** AsyncStorage
- **Retención:** 30 días

### Nube (Supabase)
- **Base de datos:** PostgreSQL
- **Sincronización:** Automática cuando el usuario está autenticado
- **Acceso:** Dashboard de Supabase

---

## 🔐 Seguridad

- ✅ Autenticación con Supabase Auth
- ✅ Variables de entorno protegidas
- ✅ Datos sincronizados por usuario
- ✅ Validación de entrada en cliente y servidor

---

## 📝 Estructura del Proyecto

```
full_express_taxi/
├── app/                    # Pantallas principales
│   ├── (tabs)/
│   │   ├── index.tsx      # Pantalla principal
│   │   └── _layout.tsx    # Configuración de tabs
│   └── _layout.tsx        # Layout raíz
├── components/            # Componentes reutilizables
├── hooks/                 # Hooks personalizados
├── lib/                   # Utilidades y servicios
├── assets/                # Imágenes y recursos
├── Dockerfile             # Configuración Docker
├── railway.json           # Configuración Railway
├── QUICK_DEPLOY.md        # Guía de deploy rápido
├── RAILWAY_DEPLOY.md      # Guía de deploy detallada
└── package.json           # Dependencias
```

---

## 🐛 Troubleshooting

### "Can't connect to Supabase"
- Verifica SUPABASE_URL y SUPABASE_ANON_KEY
- Asegúrate de que no haya espacios

### "Build failed"
- Ejecuta `pnpm install` localmente
- Verifica que `pnpm build` funcione

### "App crashes en Railway"
- Revisa los logs: `railway logs`
- Verifica las variables de entorno

---

## 📚 Documentación

- [Expo](https://docs.expo.dev)
- [React Native](https://reactnative.dev)
- [Supabase](https://supabase.com/docs)
- [Railway](https://docs.railway.app)
- [NativeWind](https://www.nativewind.dev)

---

## 🤝 Soporte

- GitHub Issues: https://github.com/agrolara/Manusfichero/issues
- Railway Support: https://railway.app/support
- Supabase Support: https://supabase.com/support

---

## 📄 Licencia

Privado - Uso exclusivo de Agro Lara

---

**Última actualización:** Enero 2025
**Versión:** 1.0.0
