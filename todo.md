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
