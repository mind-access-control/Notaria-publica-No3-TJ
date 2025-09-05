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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Calculator,
  ArrowLeft,
  FileText,
  DollarSign,
  MapPin,
  Home,
  Download,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const procedureTypes = [
  { value: "compraventa", label: "Compraventa de Inmueble", baseRate: 0.003 },
  {
    value: "testamento",
    label: "Testamento Público Abierto",
    baseRate: 0.001,
    fixedFee: 2500,
  },
  {
    value: "poder-general",
    label: "Poder General",
    baseRate: 0.0015,
    fixedFee: 1800,
  },
  {
    value: "poder-especial",
    label: "Poder Especial",
    baseRate: 0.001,
    fixedFee: 1200,
  },
  {
    value: "sociedad",
    label: "Constitución de Sociedad",
    baseRate: 0.002,
    fixedFee: 5000,
  },
  {
    value: "divorcio",
    label: "Divorcio por Mutuo Consentimiento",
    baseRate: 0,
    fixedFee: 8000,
  },
  {
    value: "reconocimiento",
    label: "Reconocimiento de Firmas",
    baseRate: 0,
    fixedFee: 500,
  },
];

const locations = [
  { value: "tijuana-centro", label: "Tijuana Centro", multiplier: 1.0 },
  { value: "tijuana-zona-rio", label: "Zona Río", multiplier: 1.1 },
  { value: "playas-tijuana", label: "Playas de Tijuana", multiplier: 1.05 },
  { value: "otay", label: "Otay", multiplier: 0.95 },
  { value: "tecate", label: "Tecate", multiplier: 0.9 },
  { value: "rosarito", label: "Rosarito", multiplier: 0.95 },
];

export default function SimuladorPage() {
  const [selectedProcedure, setSelectedProcedure] = useState("");
  const [propertyValue, setPropertyValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [results, setResults] = useState<any>(null);

  const calculateFees = () => {
    if (!selectedProcedure || !selectedLocation) return;

    const procedure = procedureTypes.find((p) => p.value === selectedProcedure);
    const location = locations.find((l) => l.value === selectedLocation);

    if (!procedure || !location) return;

    const value = Number.parseFloat(propertyValue) || 0;

    // Calculate notarial fees
    let notarialFee = 0;
    if (procedure.fixedFee) {
      notarialFee = procedure.fixedFee;
    }
    if (procedure.baseRate && value > 0) {
      notarialFee += value * procedure.baseRate;
    }

    // Apply location multiplier
    notarialFee *= location.multiplier;

    // Calculate taxes and additional fees
    const iva = notarialFee * 0.16; // 16% IVA
    const registryFee = value > 0 ? Math.max(value * 0.001, 500) : 300;
    const appraisalFee = value > 0 ? Math.min(value * 0.002, 5000) : 0;
    const searchFee = 800;
    const copyFee = 200;

    const subtotal =
      notarialFee + registryFee + appraisalFee + searchFee + copyFee;
    const total = subtotal + iva;

    setResults({
      procedure: procedure.label,
      location: location.label,
      propertyValue: value,
      breakdown: {
        notarialFee,
        registryFee,
        appraisalFee,
        searchFee,
        copyFee,
        iva,
        subtotal,
        total,
      },
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const downloadResults = () => {
    if (!results) return;

    const content = `
SIMULADOR DE ARANCELES NOTARIALES
Notaría Pública No. 3 Tijuana

DATOS DEL TRÁMITE:
- Tipo de Trámite: ${results.procedure}
- Ubicación: ${results.location}
${
  results.propertyValue > 0
    ? `- Valor del Bien: ${formatCurrency(results.propertyValue)}`
    : ""
}

DESGLOSE DE COSTOS:
- Honorarios Notariales: ${formatCurrency(results.breakdown.notarialFee)}
${
  results.breakdown.registryFee > 0
    ? `- Derechos de Registro: ${formatCurrency(results.breakdown.registryFee)}`
    : ""
}
${
  results.breakdown.appraisalFee > 0
    ? `- Avalúo: ${formatCurrency(results.breakdown.appraisalFee)}`
    : ""
}
- Búsquedas: ${formatCurrency(results.breakdown.searchFee)}
- Copias Certificadas: ${formatCurrency(results.breakdown.copyFee)}

SUBTOTAL: ${formatCurrency(results.breakdown.subtotal)}
IVA (16%): ${formatCurrency(results.breakdown.iva)}

TOTAL ESTIMADO: ${formatCurrency(results.breakdown.total)}

IMPORTANTE: Esta es una estimación. Los costos finales pueden variar según las características específicas del trámite. Para un presupuesto exacto, agenda una consulta gratuita.

Fecha de cálculo: ${new Date().toLocaleDateString("es-MX")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `simulador-aranceles-${results.procedure
      .replace(/\s+/g, "-")
      .toLowerCase()}-${new Date().toISOString().split("T")[0]}.txt`;
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
              Calculadora de Aranceles
            </Badge>

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Simulador de <span className="text-primary">Aranceles</span>
            </h1>

            <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-3xl mx-auto">
              Calcula de manera rápida y precisa el costo estimado de tu trámite
              notarial. Obtén un desglose detallado de todos los gastos
              involucrados.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Input Form */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Datos del Trámite
                </CardTitle>
                <CardDescription>
                  Completa la información para calcular los aranceles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="procedure">Tipo de Trámite</Label>
                  <Select
                    value={selectedProcedure}
                    onValueChange={setSelectedProcedure}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de trámite" />
                    </SelectTrigger>
                    <SelectContent>
                      {procedureTypes.map((procedure) => (
                        <SelectItem
                          key={procedure.value}
                          value={procedure.value}
                        >
                          {procedure.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Valor del Bien (MXN)</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="Ej: 2,500,000"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Opcional para algunos trámites. Requerido para compraventas.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Select
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={calculateFees}
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={!selectedProcedure || !selectedLocation}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Calcular Aranceles
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Desglose de Costos
                </CardTitle>
                <CardDescription>
                  {results
                    ? "Estimación detallada de gastos"
                    : "Los resultados aparecerán aquí"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{results.procedure}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{results.location}</span>
                      </div>
                      {results.propertyValue > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Home className="h-4 w-4" />
                          <span>
                            Valor: {formatCurrency(results.propertyValue)}
                          </span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Honorarios Notariales</span>
                        <span className="text-sm font-medium">
                          {formatCurrency(results.breakdown.notarialFee)}
                        </span>
                      </div>

                      {results.breakdown.registryFee > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm">Derechos de Registro</span>
                          <span className="text-sm font-medium">
                            {formatCurrency(results.breakdown.registryFee)}
                          </span>
                        </div>
                      )}

                      {results.breakdown.appraisalFee > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm">Avalúo</span>
                          <span className="text-sm font-medium">
                            {formatCurrency(results.breakdown.appraisalFee)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-sm">Búsquedas</span>
                        <span className="text-sm font-medium">
                          {formatCurrency(results.breakdown.searchFee)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm">Copias Certificadas</span>
                        <span className="text-sm font-medium">
                          {formatCurrency(results.breakdown.copyFee)}
                        </span>
                      </div>

                      <Separator />

                      <div className="flex justify-between">
                        <span className="text-sm">Subtotal</span>
                        <span className="text-sm font-medium">
                          {formatCurrency(results.breakdown.subtotal)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm">IVA (16%)</span>
                        <span className="text-sm font-medium">
                          {formatCurrency(results.breakdown.iva)}
                        </span>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-primary">Total Estimado</span>
                        <span className="text-primary">
                          {formatCurrency(results.breakdown.total)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-card p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-3">
                        * Esta es una estimación. Los costos finales pueden
                        variar según las características específicas del
                        trámite. Para un presupuesto exacto, agenda una consulta
                        gratuita.
                      </p>
                      <Button
                        onClick={downloadResults}
                        variant="outline"
                        size="sm"
                        className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Descargar Resultados
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Completa los datos para ver el cálculo</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Necesitas una cotización exacta?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Agenda una consulta gratuita y recibe un presupuesto personalizado
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/citas">
              <Button
                size="lg"
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90 cursor-pointer"
              >
                Agendar Consulta Gratuita
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
              Contactar por WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
