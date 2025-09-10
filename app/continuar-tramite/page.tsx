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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Phone,
  Mail,
  FileText,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ContinuarTramitePage() {
  const [searchMethod, setSearchMethod] = useState<"telefono" | "email">(
    "telefono"
  );
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  // Simulación de base de datos de expedientes
  const expedientesSimulados = [
    {
      id: "EXP-001",
      tramite: "Testamento",
      cliente: "Juan Carlos García López",
      telefono: "6641234567",
      email: "juan.garcia@email.com",
      progreso: 75,
      fechaInicio: "2024-01-15",
      estado: "En Proceso",
      ultimaActividad: "2024-01-20",
    },
    {
      id: "EXP-002",
      tramite: "Compraventa",
      cliente: "María Elena Rodríguez",
      telefono: "6649876543",
      email: "maria.rodriguez@email.com",
      progreso: 45,
      fechaInicio: "2024-01-18",
      estado: "En Proceso",
      ultimaActividad: "2024-01-22",
    },
    {
      id: "EXP-003",
      tramite: "Poder Notarial",
      cliente: "Carlos Alberto Martínez",
      telefono: "6645551234",
      email: "carlos.martinez@email.com",
      progreso: 90,
      fechaInicio: "2024-01-10",
      estado: "Casi Listo",
      ultimaActividad: "2024-01-23",
    },
  ];

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError("Por favor ingresa un valor para buscar");
      return;
    }

    setIsSearching(true);
    setError("");
    setSearchResults([]);

    // Simular búsqueda
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const resultados = expedientesSimulados.filter((expediente) => {
      if (searchMethod === "telefono") {
        return expediente.telefono.includes(searchValue.replace(/\D/g, ""));
      } else {
        return expediente.email
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      }
    });

    if (resultados.length === 0) {
      setError("No se encontraron expedientes con los datos proporcionados");
    } else {
      setSearchResults(resultados);
    }

    setIsSearching(false);
  };

  const handleContinueExpediente = (expedienteId: string) => {
    // Simular redirección al expediente
    router.push(
      `/expediente-digital?expedienteId=${expedienteId}&continuar=true`
    );
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "En Proceso":
        return "text-blue-600 bg-blue-50";
      case "Casi Listo":
        return "text-green-600 bg-green-50";
      case "Pendiente":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getProgresoColor = (progreso: number) => {
    if (progreso >= 80) return "bg-green-500";
    if (progreso >= 50) return "bg-blue-500";
    return "bg-yellow-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Continuar tu Trámite
          </h1>
          <p className="text-lg text-slate-600">
            Ingresa tus datos para encontrar y continuar con tu expediente
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2 text-emerald-600" />
              Buscar Expediente
            </CardTitle>
            <CardDescription>
              Ingresa tu teléfono o correo electrónico para encontrar tu trámite
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Method Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Buscar por:</Label>
              <div className="flex space-x-4">
                <Button
                  variant={searchMethod === "telefono" ? "default" : "outline"}
                  onClick={() => setSearchMethod("telefono")}
                  className="flex items-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Teléfono
                </Button>
                <Button
                  variant={searchMethod === "email" ? "default" : "outline"}
                  onClick={() => setSearchMethod("email")}
                  className="flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Correo Electrónico
                </Button>
              </div>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <Label htmlFor="searchValue">
                {searchMethod === "telefono"
                  ? "Número de teléfono"
                  : "Correo electrónico"}
              </Label>
              <Input
                id="searchValue"
                type={searchMethod === "telefono" ? "tel" : "email"}
                placeholder={
                  searchMethod === "telefono" ? "6641234567" : "tu@email.com"
                }
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="text-lg"
              />
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchValue.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              size="lg"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar Expediente
                </>
              )}
            </Button>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Expedientes Encontrados ({searchResults.length})
            </h2>

            {searchResults.map((expediente) => (
              <Card
                key={expediente.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {expediente.tramite}
                          </h3>
                          <p className="text-sm text-slate-600">
                            Expediente: {expediente.id}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Cliente:
                          </p>
                          <p className="text-sm text-slate-600">
                            {expediente.cliente}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Estado:
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(
                              expediente.estado
                            )}`}
                          >
                            {expediente.estado}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Fecha de inicio:
                          </p>
                          <p className="text-sm text-slate-600">
                            {new Date(
                              expediente.fechaInicio
                            ).toLocaleDateString("es-MX")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Última actividad:
                          </p>
                          <p className="text-sm text-slate-600">
                            {new Date(
                              expediente.ultimaActividad
                            ).toLocaleDateString("es-MX")}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-700">
                            Progreso
                          </span>
                          <span className="text-sm text-slate-600">
                            {expediente.progreso}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgresoColor(
                              expediente.progreso
                            )}`}
                            style={{ width: `${expediente.progreso}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-6">
                      <Button
                        onClick={() => handleContinueExpediente(expediente.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Continuar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              ¿No encuentras tu expediente?
            </h3>
            <p className="text-blue-800 mb-4">
              Si no encuentras tu expediente, puede ser porque:
            </p>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>Los datos ingresados no coinciden con los registrados</li>
              <li>
                El expediente fue creado recientemente y aún no está disponible
              </li>
              <li>Necesitas contactar directamente a la notaría</li>
            </ul>
            <div className="mt-4">
              <Link href="/contacto">
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Contactar Notaría
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
