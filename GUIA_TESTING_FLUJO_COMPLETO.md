# Guía de Testing - Flujo Completo de Compraventa

## Resumen de Funcionalidades Implementadas

### ✅ Funcionalidades Completadas

1. **Sistema de Autenticación Multi-Rol**

   - Cliente, Abogado, Notario, Cajero, Admin
   - Redirección automática según rol
   - Protección de rutas
   - **🆕 Botones de credenciales de prueba** - Autocompletado con un clic

2. **Captura de Datos con OCR Simulado**

   - Componente `CompraventaDataCapture`
   - Extracción automática de datos de documentos
   - Validación de calidad de datos

3. **Dashboard Kanban para Abogados**

   - Columnas: Recibido, En Validación, En Preparación, Listo para Firma, Completado
   - Drag & Drop entre columnas
   - Filtros por tipo de trámite
   - Búsqueda por cliente/vendedor

4. **Sistema de Validación de Pagos**

   - **BLOQUEO IMPLEMENTADO**: No se puede mover a "Listo para Firma" sin pago completo
   - Indicadores visuales de estado de pago
   - Alertas cuando se intenta mover sin pago

5. **Gestión de Pagos para Cajero**

   - Dashboard de cobros
   - Estadísticas de pagos pendientes
   - Registro de pagos

6. **Panel de Notificaciones para Abogados** 🆕

   - Notificaciones en tiempo real
   - Alertas de nuevas asignaciones
   - Notificaciones de documentos subidos
   - Alertas de pagos confirmados

7. **Modal con Pestañas para Expedientes** 🆕

   - Pestaña de Información General
   - Pestaña de Documentos
   - Pestaña de Pagos
   - Pestaña de Historial (timeline completo)

8. **Mejoras en la Interfaz** 🆕
   - Header fijo en modales (no se pierde al hacer scroll)
   - Filtro "Todos" como default en el Kanban
   - Corrección de duplicación de comentarios
   - Expediente con pago completo para testing

## Cómo Probar el Flujo Completo

### Paso 1: Acceso al Sistema

1. **Iniciar la aplicación:**

   ```bash
   npm run dev
   ```

2. **Acceder a:** `http://localhost:3000`

### 🆕 Nueva Funcionalidad: Botones de Credenciales de Prueba

En la página de login (`/login`), ahora encontrarás **botones interactivos** en lugar de texto estático:

- **👤 Cliente** - Autocompleta: `cliente@notaria3tijuana.com / cliente123`
- **🛡️ Abogado** - Autocompleta: `abogado@notaria3tijuana.com / abogado123`
- **🛡️ Notario** - Autocompleta: `maria.rodriguez@notaria3tijuana.com / notario123`
- **👤 Cajero** - Autocompleta: `cajero@notaria3tijuana.com / cajero123`
- **🛡️ Admin** - Autocompleta: `admin@notaria3tijuana.com / admin123`

**¡Solo haz clic en el botón del rol que quieres probar y los campos se llenarán automáticamente!**

### Paso 2: Registro de Cliente

1. **Ir a:** `/login`
2. **Hacer clic en el botón "Cliente"** en la sección "Credenciales de prueba"
   - Los campos se llenarán automáticamente
   - Email: `cliente@notaria3tijuana.com`
   - Password: `cliente123`
3. **Hacer clic en "Iniciar Sesión"**
4. **Verificar redirección a:** `/mi-cuenta`

### Paso 3: Iniciar Trámite de Compraventa

1. **Desde el portal del cliente, buscar opción "Iniciar Trámite"**
2. **Seleccionar "Compraventa de Inmueble"**
3. **El sistema debería mostrar el componente `CompraventaDataCapture`**

### Paso 4: Captura de Datos (Simulada)

1. **Llenar datos del comprador:**

   - Nombre: Juan Carlos
   - Apellidos: Pérez García
   - CURP: HEGJ860702HMCRNN07
   - RFC: HEGJ860702ABC

2. **Llenar datos del vendedor:**

   - Nombre: María Elena
   - Apellidos: Rodríguez López
   - CURP: ROLM750315MBCDPR01
   - RFC: ROLM750315XYZ

3. **Llenar datos del inmueble:**

   - Tipo: Casa
   - Superficie: 120 m²
   - Valor de venta: $2,400,000
   - Ubicación: Calle 5 de Febrero #567, Zona Río, Tijuana

4. **Subir documentos (simulado):**
   - INE del comprador
   - INE del vendedor
   - Avalúo del inmueble
   - Escritura pública
   - CLG (Certificado de Libertad de Gravamen)

### Paso 5: Acceso como Abogado

1. **Cerrar sesión del cliente**
2. **Hacer clic en el botón "Abogado"** en la sección "Credenciales de prueba"
   - Los campos se llenarán automáticamente
   - Email: `abogado@notaria3tijuana.com`
   - Password: `abogado123`
3. **Hacer clic en "Iniciar Sesión"**
4. **Verificar redirección a:** `/abogado`

### Paso 6: Gestión en Dashboard Kanban

1. **Ver el expediente en columna "Recibido"**
2. **Arrastrar a "En Validación"**
3. **Hacer clic en el expediente para ver detalles**
4. **Agregar comentarios si es necesario**

### Paso 7: Probar Bloqueo de Pago

1. **Intentar arrastrar expediente a "Listo para Firma"**
2. **Debería aparecer alerta:**

   ```
   No se puede mover a "Listo para Firma" porque el pago no está completo.

   Saldo pendiente: $25,000.00
   Total requerido: $25,000.00

   Por favor, asegúrese de que el cliente haya realizado el pago completo antes de continuar.
   ```

### Paso 8: Acceso como Cajero

1. **Cerrar sesión del abogado**
2. **Hacer clic en el botón "Cajero"** en la sección "Credenciales de prueba"
   - Los campos se llenarán automáticamente
   - Email: `cajero@notaria3tijuana.com`
   - Password: `cajero123`
3. **Hacer clic en "Iniciar Sesión"**
4. **Verificar redirección a:** `/admin/cobros`

### Paso 9: Registrar Pago

1. **En el dashboard de cobros, ver expedientes con pago pendiente**
2. **Hacer clic en "Registrar Pago"**
3. **Completar formulario:**
   - Monto: $25,000
   - Método: Transferencia bancaria
   - Referencia: TXN123456789
   - Observaciones: Pago completo confirmado

### Paso 10: Verificar Desbloqueo

1. **Cerrar sesión del cajero**
2. **Hacer clic en el botón "Abogado"** para iniciar sesión nuevamente
3. **Ir al dashboard Kanban**
4. **Verificar que el expediente ahora muestra "Pagado"**
5. **Arrastrar a "Listo para Firma" - debería funcionar sin bloqueo**

## Datos de Prueba Disponibles

### Expedientes Mock Incluidos:

1. **NT3-2025-001** - Estado: RECIBIDO, Saldo: $25,000
2. **NT3-2025-002** - Estado: EN_VALIDACION, Saldo: $20,000
3. **NT3-2025-003** - Estado: EN_PREPARACION, Saldo: $18,000 (con pago parcial)
4. **NT3-2025-004** - Estado: LISTO_PARA_FIRMA, Saldo: $0 ✅ **PAGO COMPLETO**

### Usuarios de Prueba:

| Rol     | Email                       | Password   | Redirección   |
| ------- | --------------------------- | ---------- | ------------- |
| Cliente | cliente@notaria3tijuana.com | cliente123 | /mi-cuenta    |
| Abogado | abogado@notaria3tijuana.com | abogado123 | /abogado      |
| Notario | notario@notaria3tijuana.com | notario123 | /abogado      |
| Cajero  | cajero@notaria3tijuana.com  | cajero123  | /admin/cobros |
| Admin   | admin@notaria3tijuana.com   | admin123   | /admin        |

## Validaciones Implementadas

### ✅ Validación de Pagos

- **Bloqueo automático** al intentar mover a "Listo para Firma" sin pago completo
- **Indicadores visuales** en tarjetas del Kanban:
  - 🟢 Verde: Pagado completamente
  - 🟡 Amarillo: Pago parcial
  - 🔴 Rojo: Pago pendiente
- **Alertas informativas** con detalles del saldo pendiente

### ✅ Estados del Flujo

1. **RECIBIDO** - Expediente creado por cliente
2. **EN_VALIDACION** - Abogado revisando documentos
3. **EN_PREPARACION** - Preparando escritura
4. **LISTO_PARA_FIRMA** - ⚠️ **REQUIERE PAGO COMPLETO**
5. **COMPLETADO** - Trámite finalizado

## Próximos Pasos de Desarrollo

### 🔄 Pendientes

1. **Sistema de validación con IA** para documentos
2. **Generador de escrituras** con editor tipo DocuSign
3. **Sistema de notificaciones** inteligentes
4. **Agendado de citas** con WhatsApp/email
5. **Integración con RPPC** (Registro Público)

### 🎯 Funcionalidades Clave Implementadas

- ✅ **Control de pagos** - Bloqueo automático sin pago
- ✅ **Dashboard Kanban** - Gestión visual de expedientes
- ✅ **OCR simulado** - Extracción de datos de documentos
- ✅ **Multi-rol** - Diferentes interfaces según usuario
- ✅ **Validación de estados** - Flujo controlado

## Notas Técnicas

- **Base de datos:** Mock data en memoria (se reinicia al recargar)
- **OCR:** Simulado con datos predefinidos
- **Pagos:** Simulados, no integración real con bancos
- **Notificaciones:** Preparado para integración futura
- **Escrituras:** Estructura preparada para generación automática

---

**¡El sistema está listo para testing del flujo completo de compraventa con validación de pagos!**
