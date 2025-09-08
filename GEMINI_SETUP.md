# Configuración de Gemini para el Chatbot

## 🚀 Cómo usar Gemini real

### 1. Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key"
4. Copia tu API key

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Gemini API Key
GEMINI_API_KEY=tu_api_key_aqui

# Opcional: Configuración de voz
VOICE_PREFERENCE=female # o male
```

**Reemplaza `tu_api_key_aqui` con tu API key real de Gemini.**

### 3. Reiniciar el Servidor

```bash
npm run dev
# o
pnpm dev
```

## 🎵 Configuración de Voz

### Voces Disponibles

El sistema ahora detecta automáticamente las mejores voces disponibles:

- **Voces de Google** (mejor calidad)
- **Voces de Microsoft**
- **Voces en español**
- **Voces mexicanas**

### Configuración Automática

- **Voz femenina**: Pitch 1.1 (natural)
- **Voz masculina**: Pitch 0.9 (natural)
- **Sin voz específica**: Pitch 1.0 (neutral)

### Ver Voces Disponibles

Abre la consola del navegador (F12) para ver qué voces están disponibles:

```
Voces disponibles: Google español (es-ES), Microsoft Maria (es-ES), ...
Usando voz femenina: Google español
```

## 🔧 Solución de Problemas

### Si la voz sigue sonando rara:

1. **Verifica las voces disponibles** en la consola
2. **Cambia el navegador** (Chrome tiene mejores voces)
3. **Instala voces adicionales** en Windows/Mac

### Si Gemini no funciona:

1. **Verifica la API key** en `.env.local`
2. **Revisa la consola** para errores
3. **Verifica tu conexión** a internet
4. **Comprueba los límites** de la API

## 📊 Características de Gemini

- **Respuestas inteligentes** para cualquier pregunta
- **Contexto especializado** en servicios notariales
- **Fallback automático** a respuestas simuladas si falla
- **Configuración optimizada** para conversaciones naturales

## 💡 Consejos

- **Usa preguntas específicas** para mejores respuestas
- **El chatbot aprende** del contexto de la conversación
- **Las respuestas son más naturales** con Gemini real
- **Puedes hacer preguntas complejas** sobre derecho notarial
