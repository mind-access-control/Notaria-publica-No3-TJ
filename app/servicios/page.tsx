"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  FileText,
  Users,
  Building,
  Heart,
  Scale,
  Shield,
  Calculator,
  Calendar,
  Phone,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState } from "react";

const serviceCategories = [
  {
    title: "Compraventa de Inmuebles",
    icon: Home,
    description: "Servicios especializados en transacciones inmobiliarias",
    services: [
      {
        name: "Escrituración de Compraventa",
        description:
          "Formalización legal de la compra-venta de propiedades residenciales y comerciales",
      },
      {
        name: "Compraventa con Crédito Hipotecario",
        description:
          "Tramitación completa con instituciones bancarias y financieras",
      },
      {
        name: "Compraventa de Terrenos",
        description:
          "Escrituración de lotes urbanos y rurales con verificación de títulos",
      },
      {
        name: "Donación de Inmuebles",
        description: "Formalización de donaciones entre familiares o terceros",
      },
      {
        name: "Adjudicación por Herencia",
        description: "Traspaso de propiedades por sucesión hereditaria",
      },
    ],
  },
  {
    title: "Testamentos y Sucesiones",
    icon: Heart,
    description: "Protección del patrimonio familiar y planificación sucesoria",
    services: [
      {
        name: "Testamento Público Abierto",
        description:
          "Elaboración de testamentos con validez legal plena y asesoría especializada",
      },
      {
        name: "Testamento Público Cerrado",
        description: "Testamentos confidenciales con máxima privacidad",
      },
      {
        name: "Testamento Ológrafo",
        description: "Validación y protocolización de testamentos manuscritos",
      },
      {
        name: "Tramitación de Sucesiones",
        description:
          "Proceso completo de sucesión intestamentaria y testamentaria",
      },
      {
        name: "Inventarios y Avalúos",
        description: "Determinación y valuación de bienes hereditarios",
      },
    ],
  },
  {
    title: "Poderes Notariales",
    icon: Scale,
    description: "Representación legal confiable para diversos trámites",
    services: [
      {
        name: "Poder General para Actos de Administración",
        description: "Facultades amplias para manejo de bienes y negocios",
      },
      {
        name: "Poder General para Actos de Dominio",
        description:
          "Autorización para venta, hipoteca y disposición de bienes",
      },
      {
        name: "Poder Especial",
        description: "Poderes específicos para trámites particulares",
      },
      {
        name: "Poder para Pleitos y Cobranzas",
        description: "Representación en procesos judiciales y administrativos",
      },
      {
        name: "Revocación de Poderes",
        description: "Cancelación formal de poderes previamente otorgados",
      },
    ],
  },
  {
    title: "Constitución de Sociedades",
    icon: Building,
    description: "Formalización de empresas y sociedades mercantiles",
    services: [
      {
        name: "Sociedad Anónima (S.A.)",
        description:
          "Constitución de sociedades de capital con responsabilidad limitada",
      },
      {
        name: "Sociedad de Responsabilidad Limitada (S. de R.L.)",
        description: "Sociedades de socios con participaciones sociales",
      },
      {
        name: "Sociedad en Comandita Simple",
        description: "Sociedades con socios comanditados y comanditarios",
      },
      {
        name: "Modificaciones Societarias",
        description:
          "Cambios de denominación, objeto social, capital y administración",
      },
      {
        name: "Disolución y Liquidación",
        description: "Proceso formal de terminación de sociedades",
      },
    ],
  },
  {
    title: "Actos Familiares",
    icon: Users,
    description: "Servicios notariales para asuntos del derecho familiar",
    services: [
      {
        name: "Divorcio por Mutuo Consentimiento",
        description: "Divorcio administrativo sin necesidad de juicio",
      },
      {
        name: "Convenios Matrimoniales",
        description: "Capitulaciones matrimoniales y separación de bienes",
      },
      {
        name: "Reconocimiento de Hijos",
        description: "Formalización del reconocimiento de paternidad",
      },
      {
        name: "Adopción Simple",
        description: "Tramitación notarial de adopciones",
      },
      {
        name: "Emancipación",
        description: "Declaración de mayoría de edad anticipada",
      },
    ],
  },
  {
    title: "Otros Servicios",
    icon: FileText,
    description: "Servicios notariales complementarios",
    services: [
      {
        name: "Reconocimiento de Firmas",
        description: "Certificación de autenticidad de firmas en documentos",
      },
      {
        name: "Certificación de Copias",
        description: "Cotejo y certificación de documentos",
      },
      {
        name: "Protocolización de Documentos",
        description: "Incorporación de documentos al protocolo notarial",
      },
      {
        name: "Ratificación de Contratos",
        description: "Validación notarial de acuerdos privados",
      },
      {
        name: "Información Testimonial",
        description: "Acreditación de hechos mediante testigos",
      },
      {
        name: "Declaratorias de Ausencia",
        description: "Procedimientos por ausencia de personas",
      },
    ],
  },
];

export default function ServiciosPage() {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
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
              Servicios Notariales Completos
            </Badge>

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Nuestros <span className="text-primary">Servicios</span>
            </h1>

            <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-3xl mx-auto">
              Ofrecemos una amplia gama de servicios notariales con la más alta
              calidad y profesionalismo. Cada trámite es atendido con dedicación
              y experiencia de más de 20 años.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/simulador">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 cursor-pointer"
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  Simular Aranceles
                </Button>
              </Link>
              <Link href="/citas">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent cursor-pointer"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Agendar Cita
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {serviceCategories.map((category, categoryIndex) => {
              const IconComponent = category.icon;
              return (
                <div key={categoryIndex} className="space-y-8">
                  {/* Category Header */}
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-primary/10 rounded-2xl">
                        <IconComponent className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">
                      {category.title}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      {category.description}
                    </p>
                  </div>

                  {/* Services Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.services.map((service, serviceIndex) => (
                      <Card
                        key={serviceIndex}
                        className="border-border hover:shadow-lg transition-all hover:scale-105 group"
                      >
                        <CardHeader>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {service.name}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground leading-relaxed">
                            {service.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary-foreground hover:bg-primary w-full cursor-pointer"
                            onClick={() => handleServiceClick(service)}
                          >
                            Más Información
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿No encuentras el servicio que necesitas?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contáctanos para recibir asesoría personalizada sobre tu trámite
            específico
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto">
              <Button
                size="lg"
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90 cursor-pointer"
              >
                <Phone className="mr-2 h-5 w-5" />
                Consulta Gratuita
              </Button>
            </Link>
            <Link href="/simulador">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent cursor-pointer"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calcular Aranceles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Service Detail Modal */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedService.name}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  className="cursor-pointer"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {selectedService.description}
                </p>

                <div className="bg-card p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    Información Adicional
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Tiempo estimado: 1-3 días hábiles</li>
                    <li>• Documentos requeridos: Identificación oficial</li>
                    <li>• Costo: Consultar aranceles actualizados</li>
                    <li>• Asesoría incluida sin costo adicional</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-4">
                  <Link href="/citas" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
                      <Calendar className="mr-2 h-4 w-4" />
                      Agendar Cita
                    </Button>
                  </Link>
                  <Link href="/simulador" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    >
                      <Calculator className="mr-2 h-4 w-4" />
                      Calcular Costo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
