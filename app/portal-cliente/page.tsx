"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Search,
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function PortalClientePage() {
  const [expedientCode, setExpedientCode] = useState("");
  const [caseInfo, setCaseInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "info",
      message:
        "Recuerda que puedes consultar tu expediente las 24 horas del día",
      date: "2024-01-20",
    },
  ]);

  const searchCase = async () => {
    if (!expedientCode.trim()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock data for demonstration
      const mockCase = {
        code: expedientCode,
        type: "Compraventa de Inmueble",
        client: "Juan Carlos Pérez González",
        property: "Casa en Zona Río, Tijuana",
        status: "En Proceso",
        progress: 65,
        startDate: "2024-01-15",
        estimatedCompletion: "2024-02-28",
        steps: [
          {
            name: "Recepción de Documentos",
            status: "completed",
            date: "2024-01-15",
          },
          { name: "Revisión Legal", status: "completed", date: "2024-01-20" },
          {
            name: "Búsquedas en Registro Público",
            status: "completed",
            date: "2024-01-25",
          },
          {
            name: "Elaboración de Escritura",
            status: "in-progress",
            date: null,
          },
          { name: "Firma de Escritura", status: "pending", date: null },
          { name: "Registro de Escritura", status: "pending", date: null },
          { name: "Entrega de Documentos", status: "pending", date: null },
        ],
        documents: [
          { name: "Contrato de Compraventa", status: "received" },
          { name: "Identificaciones", status: "received" },
          { name: "Comprobantes de Ingresos", status: "received" },
          { name: "Avalúo Comercial", status: "pending" },
        ],
        nextAppointment: "2024-02-10 10:00 AM",
        notes:
          "Pendiente recibir avalúo comercial actualizado. Una vez recibido, se procederá con la elaboración final de la escritura.",
      };

      setCaseInfo(mockCase);
      setIsLoading(false);
    }, 1500);
  };

  const clearSearch = () => {
    setExpedientCode("");
    setCaseInfo(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Notifications Section - Added before search */}
      {notifications.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-4">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className="border-primary/20 bg-primary/5"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.date}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

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
              Seguimiento de Expedientes
            </Badge>

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Portal del <span className="text-primary">Cliente</span>
            </h1>

            <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-3xl mx-auto">
              Consulta el estatus de tu expediente en tiempo real. Ingresa tu
              código único para ver el progreso de tu trámite.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card className="border-border">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Buscar Expediente
                </CardTitle>
                <CardDescription>
                  Ingresa el código de tu expediente para consultar su estatus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código de Expediente</Label>
                  <Input
                    id="code"
                    placeholder="Ej: EXP-2024-001234"
                    value={expedientCode}
                    onChange={(e) => setExpedientCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && expedientCode.trim()) {
                        searchCase();
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    El código se encuentra en tu recibo o confirmación inicial
                  </p>
                </div>

                <Button
                  onClick={searchCase}
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={!expedientCode.trim() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Consultando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Consultar Estatus
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Case Information */}
      {caseInfo && (
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end mb-6">
              <Button
                variant="outline"
                onClick={clearSearch}
                className="cursor-pointer"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Nueva Búsqueda
              </Button>
            </div>
            <div className="space-y-8">
              {/* Case Header */}
              <Card className="border-border">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl">
                        {caseInfo.type}
                      </CardTitle>
                      <CardDescription className="text-base mt-1">
                        Expediente: {caseInfo.code}
                      </CardDescription>
                    </div>
                    <Badge
                      className={getStatusColor(
                        caseInfo.status.toLowerCase().replace(" ", "-")
                      )}
                    >
                      {caseInfo.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Información General
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Cliente:</strong> {caseInfo.client}
                        </div>
                        <div>
                          <strong>Inmueble:</strong> {caseInfo.property}
                        </div>
                        <div>
                          <strong>Fecha de Inicio:</strong> {caseInfo.startDate}
                        </div>
                        <div>
                          <strong>Fecha Estimada:</strong>{" "}
                          {caseInfo.estimatedCompletion}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Progreso General
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completado</span>
                          <span>{caseInfo.progress}%</span>
                        </div>
                        <Progress value={caseInfo.progress} className="h-2" />
                      </div>

                      {caseInfo.nextAppointment && (
                        <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>
                              <strong>Próxima Cita:</strong>{" "}
                              {caseInfo.nextAppointment}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Process Steps */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Proceso del Trámite</CardTitle>
                  <CardDescription>
                    Seguimiento detallado de cada etapa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {caseInfo.steps.map((step: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 rounded-lg border border-border"
                      >
                        {getStatusIcon(step.status)}
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {step.name}
                          </div>
                          {step.date && (
                            <div className="text-sm text-muted-foreground">
                              Completado: {step.date}
                            </div>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className={getStatusColor(step.status)}
                        >
                          {step.status === "completed"
                            ? "Completado"
                            : step.status === "in-progress"
                            ? "En Proceso"
                            : "Pendiente"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Documents Status */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Estado de Documentos</CardTitle>
                  <CardDescription>
                    Documentos requeridos y su estatus actual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {caseInfo.documents.map((doc: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border"
                      >
                        <FileText className="h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {doc.name}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={getStatusColor(doc.status)}
                        >
                          {doc.status === "received" ? "Recibido" : "Pendiente"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {caseInfo.notes && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Notas Importantes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{caseInfo.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Tienes Dudas sobre tu Expediente?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Nuestro equipo está disponible para resolver cualquier pregunta
            sobre tu trámite
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto">
              <Button
                size="lg"
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90 cursor-pointer"
              >
                Contactar Notaría
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent cursor-pointer"
              onClick={() =>
                window.open("https://wa.me/526641234568", "_blank")
              }
            >
              WhatsApp Directo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
