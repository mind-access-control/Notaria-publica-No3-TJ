"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Shield,
  FileText,
  ArrowLeft,
  Download,
  Upload,
  Search,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const documentCategories = [
  {
    title: "Compraventa de Inmuebles",
    documents: [
      {
        name: "Solicitud de Escritura de Compraventa",
        size: "245 KB",
        type: "PDF",
      },
      { name: "Lista de Documentos Requeridos", size: "180 KB", type: "PDF" },
      { name: "Formato de Datos del Inmueble", size: "320 KB", type: "PDF" },
      { name: "Declaratoria de No Adeudos", size: "195 KB", type: "PDF" },
    ],
  },
  {
    title: "Testamentos",
    documents: [
      {
        name: "Solicitud de Testamento Público Abierto",
        size: "280 KB",
        type: "PDF",
      },
      { name: "Formato de Datos del Testador", size: "220 KB", type: "PDF" },
      { name: "Lista de Beneficiarios", size: "165 KB", type: "PDF" },
      { name: "Inventario de Bienes", size: "340 KB", type: "PDF" },
    ],
  },
  {
    title: "Poderes Notariales",
    documents: [
      { name: "Solicitud de Poder General", size: "210 KB", type: "PDF" },
      { name: "Solicitud de Poder Especial", size: "185 KB", type: "PDF" },
      { name: "Formato de Datos del Otorgante", size: "155 KB", type: "PDF" },
      { name: "Formato de Datos del Apoderado", size: "160 KB", type: "PDF" },
    ],
  },
  {
    title: "Constitución de Sociedades",
    documents: [
      {
        name: "Solicitud de Constitución de S.A.",
        size: "420 KB",
        type: "PDF",
      },
      {
        name: "Solicitud de Constitución de S. de R.L.",
        size: "380 KB",
        type: "PDF",
      },
      { name: "Formato de Datos de Socios", size: "290 KB", type: "PDF" },
      { name: "Estatutos Sociales Modelo", size: "650 KB", type: "PDF" },
    ],
  },
  {
    title: "Actos Familiares",
    documents: [
      {
        name: "Solicitud de Divorcio por Mutuo Consentimiento",
        size: "310 KB",
        type: "PDF",
      },
      { name: "Convenio de Divorcio", size: "275 KB", type: "PDF" },
      {
        name: "Formato de Reconocimiento de Hijos",
        size: "190 KB",
        type: "PDF",
      },
    ],
  },
  {
    title: "Otros Servicios",
    documents: [
      {
        name: "Solicitud de Reconocimiento de Firmas",
        size: "145 KB",
        type: "PDF",
      },
      {
        name: "Solicitud de Certificación de Copias",
        size: "130 KB",
        type: "PDF",
      },
      { name: "Formato de Protocolización", size: "240 KB", type: "PDF" },
    ],
  },
];

export default function FormatosPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Función para filtrar documentos basado en la búsqueda
  const filteredCategories = documentCategories
    .map((category) => ({
      ...category,
      documents: category.documents.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.documents.length > 0);

  // Función para simular descarga
  const handleDownload = (documentName: string) => {
    // Simular descarga creando un archivo de texto
    const content = `FORMATO: ${documentName}\n\nNotaría Pública No. 3 Tijuana\n\nEste es un formato de ejemplo. En una implementación real, aquí estaría el contenido del documento PDF.\n\nFecha: ${new Date().toLocaleDateString(
      "es-MX"
    )}`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${documentName.replace(/\s+/g, "-").toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-background to-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <Link
              href="/"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Link>

            <Badge variant="secondary" className="text-primary bg-primary/10">
              Documentos y Formatos
            </Badge>

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Descarga de <span className="text-primary">Formatos</span>
            </h1>

            <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-3xl mx-auto">
              Descarga los formatos necesarios para tu trámite notarial.
              Próximamente podrás subir documentos para auto-completar la
              información.
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar formato..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Future Feature Banner */}
      <section className="py-8 bg-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-accent/20 rounded-lg">
                <Upload className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  Próximamente: Auto-completado Inteligente
                </h3>
                <p className="text-sm text-muted-foreground">
                  Podrás subir documentos existentes y nuestro sistema
                  completará automáticamente los formatos con tu información.
                </p>
              </div>
              <Badge
                variant="secondary"
                className="text-accent-foreground bg-accent/20"
              >
                <Clock className="mr-1 h-3 w-3" />
                Próximamente
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Documents Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {category.title}
                    </h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.documents.map((document, docIndex) => (
                      <Card
                        key={docIndex}
                        className="border-border hover:shadow-lg transition-all hover:scale-105 group"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors">
                                {document.name}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {document.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {document.size}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button
                            size="sm"
                            className="w-full bg-primary hover:bg-primary/90 cursor-pointer"
                            onClick={() => handleDownload(document.name)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Descargar
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No se encontraron formatos
                </h3>
                <p className="text-muted-foreground">
                  Intenta con otros términos de búsqueda
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              ¿Necesitas Ayuda?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Si tienes dudas sobre qué documentos necesitas o cómo completar
              los formatos, nuestro equipo está aquí para ayudarte.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contacto">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 cursor-pointer"
                >
                  Consulta Gratuita
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent cursor-pointer"
                onClick={() =>
                  window.open("https://wa.me/526641234568", "_blank")
                }
              >
                Contactar por WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
