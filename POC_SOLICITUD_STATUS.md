# POC: Sistema de Estatus de Solicitudes

## Descripción
Este es un Proof of Concept (POC) para un nuevo flujo de seguimiento de solicitudes notariales. El sistema permite a los clientes ver el progreso de sus trámites en tiempo real y realizar las acciones necesarias según el estatus actual.

## Características Implementadas

### 1. Datos Mock (`lib/mock-data.ts`)
- **Interfaces TypeScript** completas para `Solicitud`, `DocumentoSolicitud`, `HistorialEstatus`
- **Datos de ejemplo** con una solicitud de testamento
- **Funciones simuladas** para obtener y actualizar solicitudes
- **Sistema de estatus** con 6 etapas principales

### 2. Página de Estatus (`app/solicitud/[numeroSolicitud]/page.tsx`)
- **Página dinámica** que acepta número de solicitud como parámetro
- **Carga asíncrona** de datos con estados de loading y error
- **Integración completa** de todos los componentes

### 3. Componentes Principales

#### SolicitudHeader (`components/solicitud-header.tsx`)
- **Información principal** de la solicitud (número, tipo, estatus)
- **Datos del cliente** y notario asignado
- **Badges de estatus** con colores dinámicos

#### SolicitudInfo (`components/solicitud-info.tsx`)
- **Información de costos** con barras de progreso
- **Estado de pagos** con alertas para saldos pendientes
- **Información del notario** asignado

#### StatusTracker (`components/status-tracker.tsx`)
- **Timeline visual** de las 6 etapas del proceso
- **Diseño responsive** (horizontal en desktop, vertical en mobile)
- **Indicadores de progreso** con iconos y colores
- **Resumen del estado actual**

#### PendingActions (`components/pending-actions.tsx`)
- **Acciones dinámicas** según el estatus actual
- **Gestión de documentos** con upload simulado
- **Sección de pagos** con alertas para saldos pendientes
- **Acciones específicas** para cada etapa:
  - Armado de expediente: Lista de documentos pendientes
  - Revisión de borrador: Botones para revisar y aprobar
  - Firma: Agendar cita de firma
  - Entrega: Descargar testimonio
  - Completado: Acceso al documento final

#### SolicitudHistory (`components/solicitud-history.tsx`)
- **Historial cronológico** de la solicitud
- **Iconos y colores** según el tipo de evento
- **Información de contacto** del notario
- **Timeline visual** con conectores

### 4. Flujo de Inicio de Trámite
- **Modificación del TramiteModal** para redirigir a la nueva página
- **Modificación del PortalPrivado** para usar el nuevo flujo
- **Generación automática** de números de solicitud únicos

## Estatus del Sistema

### Etapas Implementadas
1. **ARMANDO_EXPEDIENTE** - Cliente sube documentos
2. **EN_REVISION_INTERNA** - Notaría revisa documentos
3. **BORRADOR_PARA_REVISION_CLIENTE** - Cliente revisa borrador
4. **APROBADO_PARA_FIRMA** - Listo para firma
5. **LISTO_PARA_ENTREGA** - Testimonio listo
6. **COMPLETADO** - Trámite finalizado

### Funcionalidades por Estatus

#### ARMANDO_EXPEDIENTE
- Lista de documentos requeridos
- Upload de archivos (simulado)
- Progreso de documentos completados
- Alertas de pago pendiente

#### EN_REVISION_INTERNA
- Mensaje de estado en revisión
- Información de contacto del notario

#### BORRADOR_PARA_REVISION_CLIENTE
- Botón para revisar borrador
- Descarga del documento PDF
- Aprobación del borrador

#### APROBADO_PARA_FIRMA
- Agendar cita de firma
- Ver documento final
- Información de contacto

#### LISTO_PARA_ENTREGA
- Descargar testimonio
- Agendar recogida
- Información de entrega

#### COMPLETADO
- Descarga del testimonio final
- Acceso al historial completo
- Mensaje de felicitación

## Cómo Probar

1. **Iniciar el servidor**: `npm run dev`
2. **Acceder a la página principal**: `http://localhost:3000`
3. **Abrir modal de trámite**: Hacer clic en "Seleccionar Trámite"
4. **Seleccionar un trámite** y hacer clic en "Iniciar Trámite"
5. **Ser redirigido** a la página de estatus: `/solicitud/NT3-2025-XXXXX`

## URLs de Prueba Directa

- **Solicitud de ejemplo**: `http://localhost:3000/solicitud/NT3-2025-00123`
- **Solicitud con diferentes estatus**: Modificar `estatusActual` en `mock-data.ts`

## Características Técnicas

### Tecnologías Utilizadas
- **Next.js 14** con App Router
- **React 18** con hooks
- **TypeScript** para tipado fuerte
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **shadcn/ui** para componentes

### Arquitectura
- **Componentes modulares** y reutilizables
- **Datos mock** para simulación
- **Estados de loading** y error
- **Diseño responsive** mobile-first
- **Accesibilidad** con ARIA labels

### Mejoras Futuras Sugeridas
1. **Integración con backend** real
2. **Sistema de notificaciones** push/email
3. **Chat en vivo** con notario
4. **Pagos en línea** integrados
5. **Firma digital** de documentos
6. **Tracking de documentos** con OCR
7. **Sistema de citas** integrado
8. **Reportes y analytics** para notarios

## Estructura de Archivos

```
lib/
  mock-data.ts                 # Datos y funciones mock
app/
  solicitud/
    [numeroSolicitud]/
      page.tsx                 # Página principal de estatus
components/
  solicitud-header.tsx         # Header con info principal
  solicitud-info.tsx          # Información de costos y pagos
  status-tracker.tsx          # Timeline de estatus
  pending-actions.tsx         # Acciones pendientes dinámicas
  solicitud-history.tsx       # Historial de la solicitud
```

## Conclusión

Este POC demuestra un flujo completo de seguimiento de solicitudes notariales con una interfaz moderna, intuitiva y funcional. El sistema está diseñado para ser escalable y fácilmente integrable con un backend real.
