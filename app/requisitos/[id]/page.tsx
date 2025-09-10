"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, Download, Send, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Configuración de trámites (misma que en el admin)
const tramitesConfig = {
  compraventas: {
    nombre: "Compraventas",
    descripcion: "Contrato mediante el cual una persona (vendedor) se obliga a transferir la propiedad de un bien a otra (comprador) a cambio de un precio.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Escritura de propiedad o título de propiedad",
      "Avalúo comercial del inmueble",
      "Constancia de no adeudo de predial",
      "Constancia de no adeudo de agua",
      "Certificado de libertad de gravamen",
      "Contrato de compraventa privado (si aplica)",
    ],
    costos: {
      aranceles: 15000,
      impuestos: 5000,
      derechos: 2000,
      total: 22000,
    },
    tiempoEstimado: "15-20 días hábiles",
  },
  donaciones: {
    nombre: "Donaciones",
    descripcion: "Acto jurídico mediante el cual una persona (donante) transfiere gratuitamente un bien a otra (donatario).",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Escritura de propiedad o título de propiedad",
      "Avalúo comercial del inmueble",
      "Constancia de no adeudo de predial",
      "Constancia de no adeudo de agua",
      "Certificado de libertad de gravamen",
      "Carta de aceptación de donación",
    ],
    costos: {
      aranceles: 12000,
      impuestos: 3000,
      derechos: 1500,
      total: 16500,
    },
    tiempoEstimado: "12-15 días hábiles",
  },
  testamentos: {
    nombre: "Testamentos",
    descripcion: "Acto jurídico mediante el cual una persona dispone de sus bienes para después de su muerte.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Acta de nacimiento",
      "Acta de matrimonio (si aplica)",
      "Acta de nacimiento de hijos (si aplica)",
      "Lista de bienes y deudas",
      "Identificación de testigos",
      "Identificación de albacea (si aplica)",
    ],
    costos: {
      aranceles: 8000,
      impuestos: 2000,
      derechos: 1000,
      total: 11000,
    },
    tiempoEstimado: "5-7 días hábiles",
  },
  // Agregar más trámites según sea necesario
};

export default function RequisitosPage() {
  const params = useParams();
  const router = useRouter();
  const linkId = params.id as string;

  // Simular obtención de datos del trámite basado en el ID del link
  // En una implementación real, esto vendría de una base de datos
  const tramiteInfo = tramitesConfig.compraventas; // Por defecto, en producción se buscaría por ID

  const handleImprimir = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const content = `
        <html>
          <head>
            <title>Requisitos para ${tramiteInfo.nombre}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; }
              .content { max-width: 800px; margin: 0 auto; }
              .requisitos { margin: 20px 0; }
              .requisitos ul { list-style-type: none; padding: 0; }
              .requisitos li { margin: 8px 0; padding: 8px; background: #f5f5f5; border-left: 4px solid #3b82f6; }
              .costos { background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; }
              .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="content">
              <div class="header">
                <h1>${tramiteInfo.nombre}</h1>
                <p>Notaría Tijuana</p>
              </div>
              
              <div class="requisitos">
                <h2>Documentos Requeridos:</h2>
                <ul>
                  ${tramiteInfo.documentosRequeridos.map(doc => `<li>${doc}</li>`).join('')}
                </ul>
              </div>
              
              <div class="costos">
                <h3>Desglose de Costos:</h3>
                <p><strong>Aranceles:</strong> $${tramiteInfo.costos.aranceles.toLocaleString()}</p>
                <p><strong>Impuestos:</strong> $${tramiteInfo.costos.impuestos.toLocaleString()}</p>
                <p><strong>Derechos:</strong> $${tramiteInfo.costos.derechos.toLocaleString()}</p>
                <p><strong>Total:</strong> $${tramiteInfo.costos.total.toLocaleString()}</p>
              </div>
              
              <p><strong>Tiempo Estimado:</strong> ${tramiteInfo.tiempoEstimado}</p>
              
              <div class="footer">
                <p>Documento generado el ${new Date().toLocaleDateString('es-MX')}</p>
                <p>Notaría Tijuana - Sistema de Gestión de Expedientes</p>
              </div>
            </div>
          </body>
        </html>
      `;
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDescargarPDF = () => {
    // Simular descarga de PDF
    alert("Funcionalidad de descarga PDF en desarrollo");
  };

  const handleEnviarPorEmail = () => {
    const subject = `Requisitos para ${tramiteInfo.nombre} - Notaría Tijuana`;
    const body = `Estimado/a cliente,

Adjunto encontrará la información completa para el trámite de ${tramiteInfo.nombre}:

DESCRIPCIÓN:
${tramiteInfo.descripcion}

DOCUMENTOS REQUERIDOS:
${tramiteInfo.documentosRequeridos.map((doc, index) => `${index + 1}. ${doc}`).join('\n')}

COSTOS:
- Aranceles: $${tramiteInfo.costos.aranceles.toLocaleString()}
- Impuestos: $${tramiteInfo.costos.impuestos.toLocaleString()}
- Derechos: $${tramiteInfo.costos.derechos.toLocaleString()}
- TOTAL: $${tramiteInfo.costos.total.toLocaleString()}

TIEMPO ESTIMADO: ${tramiteInfo.tiempoEstimado}

Para cualquier consulta, no dude en contactarnos.

Saludos cordiales,
Notaría Tijuana`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const handleEnviarPorWhatsApp = () => {
    const message = `Hola! Te envío la información para el trámite de *${tramiteInfo.nombre}*:

📋 *Documentos requeridos:*
${tramiteInfo.documentosRequeridos.map((doc, index) => `${index + 1}. ${doc}`).join('\n')}

💰 *Costos:*
• Aranceles: $${tramiteInfo.costos.aranceles.toLocaleString()}
• Impuestos: $${tramiteInfo.costos.impuestos.toLocaleString()}
• Derechos: $${tramiteInfo.costos.derechos.toLocaleString()}
• *TOTAL: $${tramiteInfo.costos.total.toLocaleString()}*

⏰ *Tiempo estimado:* ${tramiteInfo.tiempoEstimado}

¿Tienes alguna pregunta? ¡Estoy aquí para ayudarte!

Notaría Tijuana`;

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {tramiteInfo.nombre}
          </h1>
          <p className="text-gray-600 mt-2">
            Notaría Tijuana - Requisitos y Documentación
          </p>
        </div>

        {/* Información del Trámite */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-blue-900">Descripción del Trámite</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{tramiteInfo.descripcion}</p>
          </CardContent>
        </Card>

        {/* Documentos Requeridos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-blue-900">Documentos Requeridos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tramiteInfo.documentosRequeridos.map((documento, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">{documento}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Costos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-blue-900">Desglose de Costos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Aranceles Notariales:</span>
                <span className="font-semibold">${tramiteInfo.costos.aranceles.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Impuestos:</span>
                <span className="font-semibold">${tramiteInfo.costos.impuestos.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Derechos:</span>
                <span className="font-semibold">${tramiteInfo.costos.derechos.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4">
                <span className="text-lg font-bold text-blue-900">Total:</span>
                <span className="text-xl font-bold text-blue-900">${tramiteInfo.costos.total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tiempo Estimado */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                Tiempo Estimado
              </Badge>
              <span className="text-lg font-semibold text-gray-800">
                {tramiteInfo.tiempoEstimado}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900">Acciones Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleImprimir}
                className="flex items-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>Imprimir</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleDescargarPDF}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Descargar PDF</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleEnviarPorEmail}
                className="flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Enviar por Email</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleEnviarPorWhatsApp}
                className="flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Enviar por WhatsApp</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Documento generado el {new Date().toLocaleDateString('es-MX')}</p>
          <p>Notaría Tijuana - Sistema de Gestión de Expedientes</p>
        </div>
      </div>
    </div>
  );
}
