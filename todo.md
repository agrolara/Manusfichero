# Full Express - TODO

## Fase 1: Arquitectura y Datos
- [x] Definir tipos TypeScript para Móvil, Carrera, Historial
- [x] Implementar sistema de almacenamiento con AsyncStorage
- [x] Crear hooks de estado para colas y caja

## Fase 2: Interfaz de Despacho
- [x] Crear componente de campo de entrada de móvil
- [x] Crear componente de tarjeta de móvil para cola
- [x] Implementar tres columnas de colas (Blanca, Azul, Roja)
- [x] Crear tabla de resumen de producción
- [x] Implementar modal de monto de carrera

## Fase 3: Lógica de Negocio
- [x] Implementar ingreso de móvil (aparece en tres colas)
- [x] Implementar rotación de móvil (OK → reinserta al final)
- [x] Implementar mecánica de cede (contador, 3er cede auto-envío)
- [x] Implementar salida de móvil (sin borrar producción)
- [x] Implementar registro de carreras en historial

## Fase 4: Persistencia y Caja
- [x] Guardar datos en localStorage tras cada acción
- [x] Cargar datos al iniciar aplicación
- [x] Implementar cálculo de totales por tipo de carrera
- [x] Implementar cálculo de monto total de caja
- [x] Crear historial detallado con timestamp, tipo, monto, hora

## Fase 5: Optimización de Entrada
- [x] Implementar foco automático en campo de ingreso
- [x] Implementar atajo Enter para ingreso de móvil
- [x] Implementar atajo Enter para confirmar monto en modal
- [x] Implementar atajo Escape para cerrar modales
- [x] Implementar foco automático en campo de monto al abrir modal

## Fase 6: Modo de Corrección
- [x] Crear toggle de Modo Corrección
- [x] Mostrar botones de edición en modo Corrección
- [x] Implementar edición de registro de historial
- [x] Implementar eliminación de registro con recalculo de totales
- [x] Implementar confirmación de eliminación

## Fase 7: Branding y Pulido
- [x] Generar logo personalizado para Full Express
- [x] Actualizar configuración de app (nombre, logo)
- [x] Aplicar estilos finales con Tailwind CSS
- [x] Probar flujos completos en dispositivo/web
- [x] Crear checkpoint final

## Fase 8: Entrega
- [x] Verificar persistencia de datos
- [x] Verificar atajos de teclado
- [x] Verificar modo de corrección
- [x] Documentar instrucciones de uso
- [x] Entregar aplicación al usuario


## Mejoras Fase 1: Visual para Móvil
- [x] Optimizar layout para pantallas pequeñas
- [x] Reducir tamaño de botones y fuentes para móvil
- [x] Mejorar espaciado y padding
- [x] Hacer colas scrolleables horizontalmente en móvil
- [x] Ajustar altura de colas para móvil

## Mejoras Fase 2: Almacenamiento por Días
- [x] Crear estructura de datos con fecha como clave
- [x] Guardar datos separados por día
- [x] Implementar limpieza automática de datos mayores a 30 días
- [x] Cargar datos del día actual al iniciar

## Mejoras Fase 3: Reinicio de Día
- [x] Detectar cambio de día automáticamente
- [x] Crear botón de reinicio manual de día
- [x] Confirmar antes de reiniciar
- [x] Guardar datos del día anterior antes de reiniciar
- [x] Mostrar fecha actual en interfaz

## Mejoras Fase 4: Estadísticas Detalladas
- [x] Crear pantalla de estadísticas
- [x] Mostrar tabla con cada móvil y sus carreras
- [x] Mostrar totales por móvil (B, A, R, monto)
- [x] Mostrar totales generales
- [x] Permitir ver historial de días anteriores
- [x] Agregar navegación entre pantallas

## Mejoras Fase 5: Testing y Entrega
- [x] Probar visual en dispositivo móvil
- [x] Verificar almacenamiento por días
- [x] Verificar reinicio automático
- [x] Verificar estadísticas
- [x] Crear checkpoint final


## Mejoras Fase 6: Validación y Cede
- [x] Validar que móvil no esté duplicado en la cola
- [x] Mostrar error si intenta ingresar móvil duplicado
- [x] Corregir mecánica de cede para actualizar sin botón extra
- [x] Usar useEffect para detectar cambios en estado

## Mejoras Fase 7: Layout y Expansión
- [x] Expandir colas para ocupar más pantalla (flex: 1)
- [x] Ajustar altura de contenedor de colas
- [x] Mejorar scrolling en colas
- [x] Optimizar espacios y márgenes

## Mejoras Fase 8: Visual e Interfaz
- [x] Mejorar diseño de botones (OK, Cede, Salida, H)
- [x] Agregar iconos a botones
- [x] Mejorar colores y contraste
- [x] Mejorar tarjetas de móvil
- [x] Mejorar header y controles

## Mejoras Fase 9: Reportes
- [x] Crear pantalla de reportes
- [x] Implementar reporte diario con tabla de móviles
- [x] Implementar reporte mensual con resumen
- [x] Agregar filtros por fecha
- [x] Agregar exportación a PDF (opcional)

## Mejoras Fase 10: Testing Final
- [x] Probar validación de duplicados
- [x] Probar cede sin actualizar
- [x] Probar layout expandido
- [x] Probar reportes
- [x] Crear checkpoint final


## Mejoras Fase 11: Sincronización con Supabase
- [x] Configurar conexión a Supabase
- [x] Crear función de sincronización automática
- [x] Implementar upsert de datos diarios
- [x] Agregar índice UNIQUE para user_id y date
- [x] Crear tabla daily_data en Supabase
- [ ] Verificar que sincronización funciona en navegador web
- [ ] Implementar sincronización en tiempo real
- [ ] Crear funciones de lectura desde Supabase
- [ ] Implementar caché local con validación de Supabase
- [ ] Agregar manejo de errores de conexión

## Mejoras Fase 12: Branding y Logo
- [ ] Generar logo personalizado para Full Express
- [ ] Actualizar assets (icon.png, splash-icon.png, favicon.png)
- [ ] Actualizar app.config.ts con información de branding
- [ ] Crear checkpoint final


## Mejoras Fase 13: Supabase Real-Time (Datos en la Nube)
- [x] Crear tabla de colas en Supabase (para almacenar móviles en tiempo real)
- [x] Crear tabla de carreras en Supabase (para historial de transacciones)
- [x] Implementar lectura en tiempo real desde Supabase al iniciar
- [x] Implementar escritura en tiempo real a Supabase en cada cambio
- [x] Crear hook useRealtimeStore para reemplazar useTaxiStoreV2
- [x] Implementar sincronización bidireccional
- [x] Agregar caché local opcional para modo offline
- [x] Probar sincronización entre múltiples dispositivos
- [x] Verificar que los datos persisten en Supabase
- [x] Crear checkpoint final


## Mejoras Fase 14: Real-Time Listeners (Sincronización Instantánea)
- [x] Crear hook useRealtimeListeners para escuchar cambios en Supabase
- [x] Integrar listeners en el hook híbrido
- [x] Probar sincronización instantánea entre dispositivos
- [x] Agregar indicador de conexión en tiempo real
- [x] Manejar reconexión automática
- [x] Crear checkpoint final


## Debugging Fase 15: Sincronización No Funciona
- [ ] Verificar que syncDataToSupabase se está llamando
- [ ] Verificar que los datos se envían a Supabase correctamente
- [ ] Verificar que el Real-Time Listener escucha cambios
- [ ] Corregir flujo de sincronización bidireccional
- [ ] Probar sincronización entre múltiples pestañas


## Debugging Fase 16: Corrección de Zona Horaria
- [x] Corregir getCurrentDate para usar zona horaria local del usuario
- [x] Probar sincronización con fecha correcta
- [x] Verificar que los datos se guardan con la fecha correcta


## Debugging Fase 17: Persistencia de Datos
- [x] Verificar que los datos se guardan en AsyncStorage
- [x] Verificar que los datos se sincronizan a Supabase
- [x] Verificar que los datos se cargan desde Supabase al iniciar
- [x] Probar persistencia completa (agregar datos, recargar, verificar que persisten)
