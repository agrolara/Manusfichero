# Full Express - Diseño de Interfaz Móvil

## Visión General

Aplicación móvil optimizada para **retrato (9:16)** y **uso con una mano**, diseñada para gestionar el despacho y caja de una flota de taxis con máxima eficiencia y velocidad de entrada de datos.

## Pantallas Principales

### 1. **Pantalla de Despacho (Home)**
**Contenido:**
- Campo de entrada "Nuevo Ingreso" (foco automático, Enter para confirmar)
- Tres columnas de colas de despacho:
  - **Blanca** (Local) - Borde gris
  - **Azul** (Media) - Borde azul
  - **Roja** (Larga) - Borde rojo
- Cada columna muestra tarjetas con ID de móvil, número de carreras, y botones de acción
- Tabla de resumen inferior con producción total por tipo de carrera

**Funcionalidad:**
- Ingreso de móvil → aparece al final de las tres colas simultáneamente
- Botón "OK" en carrera → modal de monto → móvil se reinserta al final de la cola
- Botón "Cede" → contador de cedes (al 3er cede, se va al final automáticamente)
- Botón "Salida" → retira móvil de colas sin borrar producción
- Modo Corrección (toggle) → habilita edición/eliminación de registros

### 2. **Modal de Monto**
**Contenido:**
- Título: "Monto de Carrera"
- Campo numérico con foco automático
- Botones: Confirmar (Enter), Cancelar (Escape)

**Funcionalidad:**
- Registra el monto en el historial del móvil
- Descuenta/suma del total de caja
- Cierra modal y reinserta móvil en cola

### 3. **Historial de Móvil (Detalle)**
**Contenido:**
- ID del móvil
- Resumen: Total carreras (B/A/R), monto total
- Tabla de historial: Timestamp, Tipo, Monto, Hora
- En modo Corrección: botones para editar/eliminar registros

**Funcionalidad:**
- Accesible desde tarjeta de móvil en cola
- Editar: modifica monto y recalcula totales
- Eliminar: resta del total y de la caja general

## Flujos de Usuario

### Flujo 1: Ingreso de Móvil
1. Usuario ingresa ID en campo "Nuevo Ingreso"
2. Presiona Enter
3. Móvil aparece al final de las tres colas
4. Campo se limpia y recupera foco

### Flujo 2: Asignar Carrera
1. Usuario toca "OK" en tarjeta de móvil
2. Modal de monto aparece con foco en campo numérico
3. Usuario ingresa monto y presiona Enter
4. Registro se agrega a historial del móvil
5. Móvil se reinserta al final de la misma cola
6. Modal cierra

### Flujo 3: Ceder Turno
1. Usuario toca "Cede" en tarjeta
2. Contador de cedes aumenta
3. Si contador < 3: móvil se reinserta al final de la cola
4. Si contador = 3: móvil se envía automáticamente al final (sin opción de ceder más)

### Flujo 4: Salida de Móvil
1. Usuario toca "Salida" en tarjeta
2. Móvil se retira de las tres colas
3. Producción acumulada se conserva en historial
4. Móvil puede reingresar posteriormente

### Flujo 5: Corrección de Historial
1. Usuario activa toggle "Modo Corrección"
2. Botones de edición/eliminación aparecen en tarjetas
3. Usuario toca "Editar" o "Eliminar" en registro
4. Cambios se aplican y totales se recalculan automáticamente

## Paleta de Colores

| Elemento | Color | Uso |
|----------|-------|-----|
| Fondo | Blanco (#FFFFFF) / Gris oscuro (#151718) | Fondo general |
| Texto principal | Negro (#11181C) / Blanco (#ECEDEE) | Títulos, etiquetas |
| Texto secundario | Gris (#687076) / Gris claro (#9BA1A6) | Subtítulos, ayuda |
| Cola Blanca | Borde gris (#E5E7EB) | Identificación visual |
| Cola Azul | Borde azul (#0a7ea4) | Identificación visual |
| Cola Roja | Borde rojo (#EF4444) | Identificación visual |
| Botón primario | Azul (#0a7ea4) | Acciones principales |
| Botón secundario | Gris (#687076) | Acciones secundarias |
| Éxito | Verde (#22C55E) | Confirmaciones |
| Error | Rojo (#EF4444) | Advertencias |

## Componentes Clave

### Tarjeta de Móvil
- ID prominente
- Contador de carreras (B/A/R)
- Total acumulado
- Botones: OK, Cede, Salida, (Editar/Eliminar en modo Corrección)
- Borde de color según cola

### Campo de Entrada
- Placeholder: "Ingresa ID de móvil"
- Tipo: numérico
- Validación: solo números
- Foco automático tras cada acción

### Modal de Monto
- Overlay oscuro
- Campo numérico centrado
- Validación: solo números positivos
- Botones: Confirmar, Cancelar

### Tabla de Resumen
- Columnas: Tipo (B/A/R), Total carreras, Monto total
- Actualización en tiempo real
- Totales generales de caja

## Consideraciones de Usabilidad

- **Foco automático**: Campo de ingreso siempre recupera foco tras acción
- **Atajos de teclado**: Enter confirma, Escape cierra modales
- **Navegación sin mouse**: Tab navega entre elementos, Enter activa botones
- **Retroalimentación**: Cambios visuales inmediatos (color, animaciones sutiles)
- **Persistencia**: Todos los datos se guardan en localStorage automáticamente
- **Seguridad**: Modo Corrección requiere confirmación visual antes de eliminar
