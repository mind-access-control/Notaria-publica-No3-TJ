import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
    }

    // Configuración del prompt para Gemini
    const systemPrompt = `Eres un asistente virtual especializado en servicios notariales de la Notaría Pública No. 3 de Tijuana, Baja California. 

Tu función es ayudar a los usuarios con información sobre:
- Testamentos y sucesiones
- Compraventas de bienes inmuebles
- Poderes notariales
- Constitución de sociedades
- Actos familiares
- Certificaciones y legalizaciones
- Agendar citas
- Descargar formatos
- Información de contacto y horarios

Responde de manera natural, amigable y conversacional, como si fueras una persona real. No uses emojis ni formato estructurado. Sé directo y útil.

Información de contacto:
- Teléfono: (664) 123-4567
- Email: info@notaria3tijuana.com
- Dirección: Av. Revolución 1234, Zona Centro, Tijuana, B.C. 22000
- Horario: Lunes a Viernes 9:00 AM - 6:00 PM, Sábados 9:00 AM - 2:00 PM

Si el usuario pregunta sobre formatos específicos, menciona que pueden descargarlos directamente.`;

    // Obtener respuesta de Gemini (real o simulada)
    const geminiResponse = await getGeminiResponse(message, systemPrompt);

    return NextResponse.json({
      response: geminiResponse,
      success: true,
    });
  } catch (error) {
    console.error("Error en API Gemini:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Función para obtener respuesta de Gemini
async function getGeminiResponse(
  message: string,
  systemPrompt: string
): Promise<string> {
  // Verificar si tenemos API key de Gemini
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "tu_api_key_aqui") {
    console.log(
      "API key de Gemini no configurada, usando respuestas simuladas"
    );
    return simulateGeminiResponse(message, systemPrompt);
  }

  try {
    // Llamada real a la API de Gemini
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nUsuario: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error de API: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error al llamar a Gemini:", error);
    // Fallback a respuestas simuladas si falla la API
    return simulateGeminiResponse(message, systemPrompt);
  }
}

// Función para simular respuesta de Gemini (fallback)
async function simulateGeminiResponse(
  message: string,
  systemPrompt: string
): Promise<string> {
  // Por ahora, simulamos respuestas inteligentes basadas en el contexto
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("formato") && lowerMessage.includes("testamento")) {
    return "Perfecto, aquí tienes el formato de testamento. Este documento incluye los datos del testador, declaración de bienes, designación de herederos y cláusulas especiales. Te recomiendo completar el formato y agendar una cita para su protocolización.";
  }

  if (
    lowerMessage.includes("formato") &&
    lowerMessage.includes("compraventa")
  ) {
    return "Excelente, aquí tienes el formato de compraventa. Este documento incluye los datos del vendedor y comprador, descripción del inmueble, precio y condiciones de pago, y las obligaciones de las partes. Te recomiendo completar el formato y agendar una cita para su protocolización.";
  }

  if (lowerMessage.includes("formato") && lowerMessage.includes("poder")) {
    return "Perfecto, aquí tienes el formato de poder. Este documento incluye los datos del poderdante y apoderado, el tipo de poder (general o especial), las facultades específicas, y la vigencia y limitaciones. Te recomiendo completar el formato y agendar una cita para su protocolización.";
  }

  if (lowerMessage.includes("cita") || lowerMessage.includes("agendar")) {
    return "Puedes agendar tu cita de tres formas diferentes. La más conveniente es a través de nuestro sistema en línea que está disponible las 24 horas del día. También puedes llamarnos al (664) 123-4567 o visitar nuestras oficinas directamente. Nuestro horario es de lunes a viernes de 9:00 a 18:00. ¿Prefieres que te ayude a agendar ahora mismo?";
  }

  if (lowerMessage.includes("testamento") || lowerMessage.includes("testar")) {
    return "Para elaborar un testamento necesitas algunos documentos básicos como identificación oficial vigente, tu CURP, comprobante de domicilio y las escrituras si tienes bienes inmuebles. El costo varía según el valor de tus bienes. ¿Te gustaría agendar una consulta gratuita para que te explique todo el proceso?";
  }

  if (
    lowerMessage.includes("compraventa") ||
    lowerMessage.includes("compra") ||
    lowerMessage.includes("venta")
  ) {
    return "El costo de una compraventa incluye varios conceptos como honorarios notariales, impuestos como ISR e IVA, gastos de registro, avalúos y búsquedas. ¿Necesitas más información específica sobre algún concepto en particular?";
  }

  if (lowerMessage.includes("poder") || lowerMessage.includes("apoderado")) {
    return "Tenemos diferentes tipos de poderes disponibles. El poder general te da facultades amplias, el especial es para actos específicos, y el de pleitos y cobranzas es para representación legal. Cada uno tiene diferentes alcances y costos. ¿Para qué necesitas el poder específicamente?";
  }

  if (lowerMessage.includes("horario") || lowerMessage.includes("horarios")) {
    return "Nuestro horario de atención es de lunes a viernes de 9:00 AM a 6:00 PM, los sábados de 9:00 AM a 2:00 PM, y cerramos los domingos. Puedes contactarnos al teléfono (664) 123-4567 o por email a info@notaria3tijuana.com.";
  }

  if (
    lowerMessage.includes("contacto") ||
    lowerMessage.includes("dirección") ||
    lowerMessage.includes("ubicación")
  ) {
    return "Nuestra información de contacto es la siguiente: estamos ubicados en Av. Revolución 1234, Zona Centro, Tijuana, B.C. 22000. Puedes llamarnos al (664) 123-4567 o escribirnos a info@notaria3tijuana.com. Nuestro horario es de lunes a viernes de 9:00 AM a 6:00 PM y sábados de 9:00 AM a 2:00 PM.";
  }

  if (
    lowerMessage.includes("servicios") ||
    lowerMessage.includes("qué hacen") ||
    lowerMessage.includes("qué ofrecen")
  ) {
    return "Ofrecemos diversos servicios notariales como testamentos y sucesiones, compraventa de bienes inmuebles, poderes notariales, constitución de sociedades, actos familiares, y certificaciones y legalizaciones. ¿Qué servicio específico te interesa?";
  }

  if (
    lowerMessage.includes("costo") ||
    lowerMessage.includes("precio") ||
    lowerMessage.includes("cuánto cuesta")
  ) {
    return "Tenemos un simulador de aranceles y costos que calcula el costo aproximado de testamentos, compraventas, poderes, sociedades y otros trámites. ¿Qué trámite específico quieres cotizar?";
  }

  if (
    lowerMessage.includes("tiempo") ||
    lowerMessage.includes("cuánto tarda") ||
    lowerMessage.includes("días")
  ) {
    return "Los tiempos estimados varían según el trámite. Los testamentos y poderes generalmente se pueden completar en 1 a 2 días, mientras que las compraventas pueden tomar entre 15 a 30 días hábiles debido a los trámites adicionales. Trabajamos para agilizar todos los procesos manteniendo la seguridad jurídica.";
  }

  // Respuesta por defecto más inteligente
  return "Gracias por tu pregunta. Para brindarte la mejor respuesta, te recomiendo contactarnos directamente al teléfono (664) 123-4567 o por email a info@notaria3tijuana.com. También puedes agendar una consulta gratuita para resolver todas tus dudas. ¿Hay algo más en lo que pueda ayudarte?";
}
