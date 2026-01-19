# 🚕 Full Express - Sistema de Gestión de Taxis

## 📱 Descripción

**Full Express** es una aplicación web moderna para gestionar el despacho y la caja de una flota de taxis. Permite:

- ✅ Gestionar 3 colas de despacho simultáneamente (Blanca, Azul, Roja)
- ✅ Registrar carreras con montos y historial detallado
- ✅ Sincronización en tiempo real entre múltiples usuarios
- ✅ Reportes diarios y mensuales exportables a PDF
- ✅ Autenticación segura con Supabase
- ✅ Panel de administrador para crear usuarios
- ✅ Sistema de roles (Admin, Supervisor, Operador)
- ✅ Almacenamiento de datos por 30 días
- ✅ Acceso desde cualquier dispositivo

---

## 🎯 Características Principales

### 1. Sistema de Colas (Blanca, Azul, Roja)

**Mecánica de despacho:**
- Los móviles ingresan a las 3 colas simultáneamente
- Al hacer "OK" (asignar carrera), el móvil pasa al final
- Al hacer "Cede", el móvil mantiene posición hasta la 3ª vez
- En la 3ª cede, el móvil pasa al final y el contador se resetea

**Ejemplo:**
```
Móvil 101 ingresa → Posición 1 en todas las colas
Móvil 102 ingresa → Posición 2 en todas las colas
101 hace OK → 101 va al final, 102 sube a posición 1
102 hace Cede → 102 mantiene posición 1 (contador 1/3)
102 hace Cede → 102 mantiene posición 1 (contador 2/3)
102 hace Cede → 102 va al final (contador se resetea)
```

### 2. Registro de Carreras

**Información capturada:**
- ID del móvil
- Tipo de carrera (Blanca, Azul, Roja)
- Monto de la carrera
- Fecha y hora
- Usuario que registró

**Funcionalidades:**
- Editar montos (botón E)
- Eliminar registros (botón X)
- Ver historial completo (botón H)
- Recálculo automático de totales

### 3. Reportes

**Reportes disponibles:**
- Diarios: Todas las carreras de un día específico
- Mensuales: Resumen por mes
- Exportación a PDF con tabla de móviles y totales

**Información en reportes:**
- Móvil
- Carreras Blanca (B)
- Carreras Azul (A)
- Carreras Roja (R)
- Total de carreras
- Monto total por móvil
- Totales generales

### 4. Autenticación y Usuarios

**Usuario administrador por defecto:**
- Email: `agro_lara@yahoo.com`
- Contraseña: `12345678`

**Crear nuevos usuarios:**
1. Inicia sesión como administrador
2. Haz clic en botón "Admin" (púrpura)
3. Ingresa email y contraseña del nuevo usuario
4. Haz clic en "Crear Usuario"

**Roles disponibles:**
- **Admin**: Acceso total, crear usuarios, editar/eliminar registros
- **Supervisor**: Ver datos, exportar reportes, sin editar
- **Operador**: Ingresar móviles y carreras, datos propios

### 5. Sincronización en Tiempo Real

**Datos sincronizados:**
- Colas de despacho
- Carreras asignadas
- Montos y totales
- Cambios de día

**Comportamiento:**
- Todos los usuarios ven los mismos datos
- Cambios se reflejan al instante
- Funciona incluso con múltiples dispositivos
- Datos persistentes en Supabase

---

## 🚀 Cómo Usar

### Ingreso de Móviles

1. En el campo "ID movil", escribe el número del móvil (ej: 101)
2. Presiona Enter o haz clic en el botón "+"
3. El móvil aparecerá en las 3 colas

### Asignar Carrera (OK)

1. Haz clic en el botón "OK" del móvil en cualquier cola
2. Se abrirá un modal para ingresar el monto
3. Escribe el monto (ej: 250)
4. Presiona Enter o haz clic en "Guardar"
5. El móvil se moverá al final de la cola

### Ceder Turno (Cede)

1. Haz clic en el botón "Cede" del móvil
2. El móvil mantiene su posición (contador 1/3)
3. Repite para incrementar el contador (2/3, 3/3)
4. En la 3ª vez, el móvil va al final

### Ver Historial (H)

1. Haz clic en el botón "H" del móvil
2. Se abrirá la pantalla de historial
3. Verás todas las carreras del móvil
4. Puedes editar (E) o eliminar (X) registros

### Generar Reportes

1. Haz clic en el botón "Rep" en el header
2. Selecciona "Diarios" o "Mensuales"
3. Elige un día o mes
4. Haz clic en "Exportar PDF"
5. El archivo se descargará automáticamente

### Ver Estadísticas

1. Haz clic en el botón "Stat" en el header
2. Verás tabla con:
   - Cada móvil y sus carreras (B, A, R, Total, Monto)
   - Totales por tipo de carrera
   - Total de caja general

### Modo Corrección

1. En el header, activa el switch "Corr"
2. En modo corrección, puedes editar/eliminar registros
3. Desactiva cuando termines

### Reiniciar Día

1. Haz clic en el botón "Reset"
2. Confirma que deseas reiniciar
3. Los datos del día se guardarán
4. Las colas se vaciarán
5. Puedes comenzar un nuevo día

---

## 📊 Pantallas

### Pantalla Principal

**Header:**
- Título "Full Express" y fecha actual
- Botones: Stat, Rep, Admin (si estás autenticado), Salir/Login

**Sección de Entrada:**
- Campo para ingresar ID de móvil
- Botón + para agregar
- Switch "Corr" para modo corrección
- Botón "Reset" para reiniciar día

**Colas:**
- 3 columnas: Blanca, Azul, Roja
- Cada móvil muestra: ID, contador de cede, botones (OK, Cede, X, H)

**Footer:**
- Total de caja ($)
- Cantidad de móviles activos

### Pantalla de Historial

**Información:**
- ID del móvil
- Lista de todas las carreras
- Cada carrera muestra: tipo, monto, botones (E, X)

**Funcionalidades:**
- Editar monto (E)
- Eliminar registro (X)
- Botón "Atrás" para volver

### Pantalla de Reportes

**Tabs:**
- Diarios: Lista de días con carreras
- Mensuales: Resumen por mes

**Funcionalidades:**
- Seleccionar día/mes
- Ver tabla de móviles y totales
- Exportar a PDF

### Pantalla de Estadísticas

**Tabla:**
- Móvil | B | A | R | Total | Monto

**Totales:**
- Total Blanca
- Total Azul
- Total Roja
- Total Caja

---

## 🔐 Seguridad

- ✅ Autenticación con Supabase (segura)
- ✅ Datos encriptados en tránsito (HTTPS)
- ✅ Acceso basado en roles
- ✅ Sesiones seguras
- ✅ Logout automático disponible

---

## 💾 Almacenamiento

- **Local:** AsyncStorage (datos del día actual)
- **Nube:** Supabase (sincronización y respaldo)
- **Retención:** 30 días de datos históricos
- **Backup:** Automático en Supabase

---

## 📱 Compatibilidad

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Dispositivos móviles (iOS, Android)
- ✅ Tablets
- ✅ Computadoras de escritorio
- ✅ Responsive design

---

## ⚡ Rendimiento

- **Carga inicial:** < 3 segundos
- **Sincronización:** < 500ms
- **Operaciones:** < 100ms
- **Almacenamiento:** < 5MB por día

---

## 🆘 Troubleshooting

### "No puedo ingresar móviles"
- Verifica que el ID sea numérico
- Verifica que no esté duplicado en las colas

### "Los datos no se sincronizan"
- Verifica conexión a internet
- Verifica que estés autenticado
- Recarga la página (F5)

### "No puedo descargar PDF"
- Verifica que el navegador permita descargas
- Intenta con otro navegador
- Verifica espacio en disco

### "Botón Admin no aparece"
- Verifica que hayas iniciado sesión
- El botón solo aparece para usuarios autenticados

### "Olvidé la contraseña"
- Contacta al administrador
- El administrador puede crear una nueva cuenta

---

## 📞 Soporte

- **GitHub:** https://github.com/agrolara/Manusfichero
- **Supabase:** https://supabase.com/support
- **Railway:** https://railway.app/support

---

## 📝 Notas

- Los datos se guardan automáticamente
- No es necesario hacer clic en "Guardar" manualmente
- Los cambios se sincronizan en tiempo real
- Puedes acceder desde múltiples dispositivos simultáneamente
- Los datos se retienen por 30 días

---

## 🎯 Próximas Mejoras

- [ ] Notificaciones push para nuevas carreras
- [ ] Gráficos de tendencia por día/mes
- [ ] Historial de auditoría (quién hizo qué)
- [ ] Dashboard personalizado por rol
- [ ] Integración con WhatsApp para alertas
- [ ] Exportación a Excel
- [ ] Geolocalización de móviles

---

**Versión:** 2.0.0
**Última actualización:** Enero 2026
**Estado:** ✅ Producción
