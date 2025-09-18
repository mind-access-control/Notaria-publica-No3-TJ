"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit3,
  Download,
  Trash2,
  User,
  Home,
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  ExpedienteCompraventa,
  Persona,
  Inmueble,
  DocumentoCompraventa,
  DocumentoTipo,
  DOCUMENTOS_COMPRAVENTA,
  DatosExtraidosOCR,
} from "@/lib/compraventa-types";
import { ocrService } from "@/lib/ocr-service";

interface CompraventaDataCaptureProps {
  expediente: ExpedienteCompraventa;
  onExpedienteUpdate: (expediente: ExpedienteCompraventa) => void;
  onComplete: () => void;
}

export function CompraventaDataCapture({
  expediente,
  onExpedienteUpdate,
  onComplete,
}: CompraventaDataCaptureProps) {
  const [activeTab, setActiveTab] = useState("comprador");
  const [uploadingDocument, setUploadingDocument] = useState<string | null>(
    null
  );
  const [showOCRResults, setShowOCRResults] = useState<string | null>(null);
  const [ocrData, setOcrData] = useState<DatosExtraidosOCR | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Calcular progreso general
  const calcularProgreso = () => {
    const documentosCompletados = expediente.documentos.filter(
      (doc) => doc.estado === "validado"
    ).length;
    const totalDocumentos = DOCUMENTOS_COMPRAVENTA.length;
    const datosCompletados = calcularDatosCompletados();

    return Math.round(
      ((documentosCompletados / totalDocumentos) * 0.6 +
        (datosCompletados / 100) * 0.4) *
        100
    );
  };

  const calcularDatosCompletados = () => {
    let completados = 0;
    let total = 0;

    // Verificar datos del comprador
    const camposComprador = [
      "nombre",
      "apellidoPaterno",
      "apellidoMaterno",
      "fechaNacimiento",
      "curp",
      "telefono",
      "email",
    ];
    camposComprador.forEach((campo) => {
      total++;
      if (expediente.comprador[campo as keyof Persona]) completados++;
    });

    // Verificar datos del vendedor
    const camposVendedor = [
      "nombre",
      "apellidoPaterno",
      "apellidoMaterno",
      "fechaNacimiento",
      "curp",
      "telefono",
      "email",
    ];
    camposVendedor.forEach((campo) => {
      total++;
      if (expediente.vendedor[campo as keyof Persona]) completados++;
    });

    // Verificar datos del inmueble
    const camposInmueble = ["tipo", "superficie", "valorAvaluo", "valorVenta"];
    camposInmueble.forEach((campo) => {
      total++;
      if (expediente.inmueble[campo as keyof Inmueble]) completados++;
    });

    return total > 0 ? (completados / total) * 100 : 0;
  };

  const handleDocumentUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    tipoDocumento: DocumentoTipo
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingDocument(tipoDocumento);

    try {
      // Procesar con OCR
      const ocrResult = await ocrService.procesarDocumento(file, tipoDocumento);

      if (ocrResult.success && ocrResult.data) {
        setOcrData(ocrResult.data);
        setShowOCRResults(tipoDocumento);

        // Validar calidad de datos
        const validacion = ocrService.validarCalidadDatos(ocrResult.data);
        setValidationErrors(validacion.errores);

        // Crear documento
        const nuevoDocumento: DocumentoCompraventa = {
          id: Date.now().toString(),
          tipo: tipoDocumento,
          nombre: file.name,
          archivo: file,
          fechaSubida: new Date().toISOString(),
          estado: validacion.esValido ? "validado" : "subido",
          datosExtraidos: ocrResult.data,
          observaciones: validacion.advertencias.join("; "),
        };

        // Actualizar expediente
        const expedienteActualizado = {
          ...expediente,
          documentos: [
            ...expediente.documentos.filter((d) => d.tipo !== tipoDocumento),
            nuevoDocumento,
          ],
          fechaUltimaActualizacion: new Date().toISOString(),
        };

        onExpedienteUpdate(expedienteActualizado);
      }
    } catch (error) {
      console.error("Error procesando documento:", error);
    } finally {
      setUploadingDocument(null);
    }
  };

  const aplicarDatosOCR = () => {
    if (!ocrData) return;

    const expedienteActualizado = { ...expediente };

    // Aplicar datos según el tipo de documento
    switch (ocrData.tipoDocumento) {
      case "identificacion_comprador":
        if (ocrData.datosPersonales) {
          Object.assign(
            expedienteActualizado.comprador,
            ocrData.datosPersonales
          );
        }
        break;
      case "identificacion_vendedor":
        if (ocrData.datosPersonales) {
          Object.assign(
            expedienteActualizado.vendedor,
            ocrData.datosPersonales
          );
        }
        break;
      case "avaluo_inmueble":
        if (ocrData.datosAvaluo) {
          expedienteActualizado.inmueble.valorAvaluo =
            ocrData.datosAvaluo.valorAvaluo || 0;
        }
        break;
      case "escritura_propiedad":
        if (ocrData.datosInmueble) {
          Object.assign(expedienteActualizado.inmueble, ocrData.datosInmueble);
        }
        break;
    }

    expedienteActualizado.fechaUltimaActualizacion = new Date().toISOString();
    onExpedienteUpdate(expedienteActualizado);
    setShowOCRResults(null);
    setOcrData(null);
  };

  const actualizarPersona = (
    tipo: "comprador" | "vendedor",
    campo: string,
    valor: string
  ) => {
    const expedienteActualizado = { ...expediente };
    expedienteActualizado[tipo] = {
      ...expedienteActualizado[tipo],
      [campo]: valor,
    };
    expedienteActualizado.fechaUltimaActualizacion = new Date().toISOString();
    onExpedienteUpdate(expedienteActualizado);
  };

  const actualizarInmueble = (campo: string, valor: any) => {
    const expedienteActualizado = { ...expediente };
    expedienteActualizado.inmueble = {
      ...expedienteActualizado.inmueble,
      [campo]: valor,
    };
    expedienteActualizado.fechaUltimaActualizacion = new Date().toISOString();
    onExpedienteUpdate(expedienteActualizado);
  };

  const renderPersonaForm = (tipo: "comprador" | "vendedor") => {
    const persona = expediente[tipo];
    const esComprador = tipo === "comprador";

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${tipo}-nombre`}>Nombre(s) *</Label>
            <Input
              id={`${tipo}-nombre`}
              value={persona.nombre}
              onChange={(e) =>
                actualizarPersona(tipo, "nombre", e.target.value)
              }
              placeholder="Ingresa el nombre"
            />
          </div>
          <div>
            <Label htmlFor={`${tipo}-apellidoPaterno`}>
              Apellido Paterno *
            </Label>
            <Input
              id={`${tipo}-apellidoPaterno`}
              value={persona.apellidoPaterno}
              onChange={(e) =>
                actualizarPersona(tipo, "apellidoPaterno", e.target.value)
              }
              placeholder="Ingresa el apellido paterno"
            />
          </div>
          <div>
            <Label htmlFor={`${tipo}-apellidoMaterno`}>Apellido Materno</Label>
            <Input
              id={`${tipo}-apellidoMaterno`}
              value={persona.apellidoMaterno}
              onChange={(e) =>
                actualizarPersona(tipo, "apellidoMaterno", e.target.value)
              }
              placeholder="Ingresa el apellido materno"
            />
          </div>
          <div>
            <Label htmlFor={`${tipo}-fechaNacimiento`}>
              Fecha de Nacimiento *
            </Label>
            <Input
              id={`${tipo}-fechaNacimiento`}
              type="date"
              value={persona.fechaNacimiento}
              onChange={(e) =>
                actualizarPersona(tipo, "fechaNacimiento", e.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor={`${tipo}-curp`}>CURP *</Label>
            <Input
              id={`${tipo}-curp`}
              value={persona.curp}
              onChange={(e) =>
                actualizarPersona(tipo, "curp", e.target.value.toUpperCase())
              }
              placeholder="Ingresa la CURP"
              maxLength={18}
            />
          </div>
          <div>
            <Label htmlFor={`${tipo}-telefono`}>Teléfono *</Label>
            <Input
              id={`${tipo}-telefono`}
              value={persona.telefono}
              onChange={(e) =>
                actualizarPersona(tipo, "telefono", e.target.value)
              }
              placeholder="+52 664 123 4567"
            />
          </div>
          <div>
            <Label htmlFor={`${tipo}-email`}>Email *</Label>
            <Input
              id={`${tipo}-email`}
              type="email"
              value={persona.email}
              onChange={(e) => actualizarPersona(tipo, "email", e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <Label htmlFor={`${tipo}-estadoCivil`}>Estado Civil *</Label>
            <Select
              value={persona.estadoCivil}
              onValueChange={(value) =>
                actualizarPersona(tipo, "estadoCivil", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona estado civil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soltero">Soltero(a)</SelectItem>
                <SelectItem value="casado">Casado(a)</SelectItem>
                <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                <SelectItem value="viudo">Viudo(a)</SelectItem>
                <SelectItem value="union_libre">Unión Libre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-3">Domicilio</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${tipo}-calle`}>Calle *</Label>
              <Input
                id={`${tipo}-calle`}
                value={persona.domicilio.calle}
                onChange={(e) =>
                  actualizarPersona(tipo, "domicilio", {
                    ...persona.domicilio,
                    calle: e.target.value,
                  })
                }
                placeholder="Nombre de la calle"
              />
            </div>
            <div>
              <Label htmlFor={`${tipo}-numeroExterior`}>
                Número Exterior *
              </Label>
              <Input
                id={`${tipo}-numeroExterior`}
                value={persona.domicilio.numeroExterior}
                onChange={(e) =>
                  actualizarPersona(tipo, "domicilio", {
                    ...persona.domicilio,
                    numeroExterior: e.target.value,
                  })
                }
                placeholder="123"
              />
            </div>
            <div>
              <Label htmlFor={`${tipo}-colonia`}>Colonia *</Label>
              <Input
                id={`${tipo}-colonia`}
                value={persona.domicilio.colonia}
                onChange={(e) =>
                  actualizarPersona(tipo, "domicilio", {
                    ...persona.domicilio,
                    colonia: e.target.value,
                  })
                }
                placeholder="Nombre de la colonia"
              />
            </div>
            <div>
              <Label htmlFor={`${tipo}-codigoPostal`}>Código Postal *</Label>
              <Input
                id={`${tipo}-codigoPostal`}
                value={persona.domicilio.codigoPostal}
                onChange={(e) =>
                  actualizarPersona(tipo, "domicilio", {
                    ...persona.domicilio,
                    codigoPostal: e.target.value,
                  })
                }
                placeholder="22000"
                maxLength={5}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInmuebleForm = () => {
    const inmueble = expediente.inmueble;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tipo-inmueble">Tipo de Inmueble *</Label>
            <Select
              value={inmueble.tipo}
              onValueChange={(value) => actualizarInmueble("tipo", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tipo de inmueble" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="departamento">Departamento</SelectItem>
                <SelectItem value="terreno">Terreno</SelectItem>
                <SelectItem value="local_comercial">Local Comercial</SelectItem>
                <SelectItem value="oficina">Oficina</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="superficie">Superficie *</Label>
            <div className="flex gap-2">
              <Input
                id="superficie"
                type="number"
                value={inmueble.superficie}
                onChange={(e) =>
                  actualizarInmueble("superficie", parseFloat(e.target.value))
                }
                placeholder="120"
              />
              <Select
                value={inmueble.superficieUnidad}
                onValueChange={(value) =>
                  actualizarInmueble("superficieUnidad", value)
                }
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m2">m²</SelectItem>
                  <SelectItem value="hectareas">Ha</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="valorAvaluo">Valor del Avalúo *</Label>
            <Input
              id="valorAvaluo"
              type="number"
              value={inmueble.valorAvaluo}
              onChange={(e) =>
                actualizarInmueble("valorAvaluo", parseFloat(e.target.value))
              }
              placeholder="2500000"
            />
          </div>
          <div>
            <Label htmlFor="valorVenta">Valor de Venta *</Label>
            <Input
              id="valorVenta"
              type="number"
              value={inmueble.valorVenta}
              onChange={(e) =>
                actualizarInmueble("valorVenta", parseFloat(e.target.value))
              }
              placeholder="2400000"
            />
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-3">Ubicación del Inmueble</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inmueble-calle">Calle *</Label>
              <Input
                id="inmueble-calle"
                value={inmueble.ubicacion.calle}
                onChange={(e) =>
                  actualizarInmueble("ubicacion", {
                    ...inmueble.ubicacion,
                    calle: e.target.value,
                  })
                }
                placeholder="Nombre de la calle"
              />
            </div>
            <div>
              <Label htmlFor="inmueble-numeroExterior">Número Exterior *</Label>
              <Input
                id="inmueble-numeroExterior"
                value={inmueble.ubicacion.numeroExterior}
                onChange={(e) =>
                  actualizarInmueble("ubicacion", {
                    ...inmueble.ubicacion,
                    numeroExterior: e.target.value,
                  })
                }
                placeholder="123"
              />
            </div>
            <div>
              <Label htmlFor="inmueble-colonia">Colonia *</Label>
              <Input
                id="inmueble-colonia"
                value={inmueble.ubicacion.colonia}
                onChange={(e) =>
                  actualizarInmueble("ubicacion", {
                    ...inmueble.ubicacion,
                    colonia: e.target.value,
                  })
                }
                placeholder="Nombre de la colonia"
              />
            </div>
            <div>
              <Label htmlFor="inmueble-codigoPostal">Código Postal *</Label>
              <Input
                id="inmueble-codigoPostal"
                value={inmueble.ubicacion.codigoPostal}
                onChange={(e) =>
                  actualizarInmueble("ubicacion", {
                    ...inmueble.ubicacion,
                    codigoPostal: e.target.value,
                  })
                }
                placeholder="22000"
                maxLength={5}
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="descripcion">Descripción del Inmueble</Label>
          <Textarea
            id="descripcion"
            value={inmueble.descripcion}
            onChange={(e) => actualizarInmueble("descripcion", e.target.value)}
            placeholder="Describe las características del inmueble..."
            rows={3}
          />
        </div>
      </div>
    );
  };

  const renderDocumentos = () => {
    return (
      <div className="space-y-6">
        <div className="grid gap-4">
          {DOCUMENTOS_COMPRAVENTA.map((tipoDocumento) => {
            const documento = expediente.documentos.find(
              (d) => d.tipo === tipoDocumento
            );
            const estaSubido = documento && documento.estado !== "pendiente";

            return (
              <Card
                key={tipoDocumento}
                className={estaSubido ? "border-green-200 bg-green-50" : ""}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-emerald-600" />
                      <div>
                        <CardTitle className="text-base">
                          {tipoDocumento
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </CardTitle>
                        <CardDescription>
                          {estaSubido
                            ? documento?.nombre
                            : "Documento requerido"}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {estaSubido ? (
                        <>
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-600"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {documento?.estado === "validado"
                              ? "Validado"
                              : "Subido"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            id={`upload-${tipoDocumento}`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) =>
                              handleDocumentUpload(e, tipoDocumento)
                            }
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document
                                .getElementById(`upload-${tipoDocumento}`)
                                ?.click()
                            }
                            disabled={uploadingDocument === tipoDocumento}
                          >
                            {uploadingDocument === tipoDocumento ? (
                              <>
                                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-2" />
                                Procesando...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Subir
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {estaSubido && documento?.datosExtraidos && (
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4" />
                      <span>
                        Confianza OCR: {documento.datosExtraidos.confianza}%
                      </span>
                      <Badge variant="outline" size="sm">
                        {documento.datosExtraidos.camposExtraidos.length} campos
                        extraídos
                      </Badge>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const progreso = calcularProgreso();
  const datosCompletados = calcularDatosCompletados();

  return (
    <div className="space-y-6">
      {/* Header con progreso */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-emerald-600" />
                Captura de Datos - Compraventa
              </CardTitle>
              <CardDescription>
                Solicitud #{expediente.numeroSolicitud} - Completa la
                información requerida
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">
                {progreso}%
              </div>
              <div className="text-sm text-gray-600">Completado</div>
            </div>
          </div>
          <Progress value={progreso} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Alertas de validación */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Errores de validación:</div>
            <ul className="list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="comprador" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Comprador
          </TabsTrigger>
          <TabsTrigger value="vendedor" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Vendedor
          </TabsTrigger>
          <TabsTrigger value="inmueble" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Inmueble
          </TabsTrigger>
          <TabsTrigger value="documentos" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comprador">
          <Card>
            <CardHeader>
              <CardTitle>Datos del Comprador</CardTitle>
              <CardDescription>
                Información personal y de contacto del comprador
              </CardDescription>
            </CardHeader>
            <CardContent>{renderPersonaForm("comprador")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendedor">
          <Card>
            <CardHeader>
              <CardTitle>Datos del Vendedor</CardTitle>
              <CardDescription>
                Información personal y de contacto del vendedor
              </CardDescription>
            </CardHeader>
            <CardContent>{renderPersonaForm("vendedor")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inmueble">
          <Card>
            <CardHeader>
              <CardTitle>Datos del Inmueble</CardTitle>
              <CardDescription>
                Información del bien inmueble objeto de la compraventa
              </CardDescription>
            </CardHeader>
            <CardContent>{renderInmuebleForm()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentos">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Requeridos</CardTitle>
              <CardDescription>
                Sube los documentos necesarios para el trámite
              </CardDescription>
            </CardHeader>
            <CardContent>{renderDocumentos()}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botón de completar */}
      <div className="flex justify-end">
        <Button
          onClick={onComplete}
          disabled={progreso < 100}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Completar Captura
        </Button>
      </div>

      {/* Modal de resultados OCR */}
      {showOCRResults && ocrData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                Resultados de Extracción OCR
              </CardTitle>
              <CardDescription>
                Confianza: {ocrData.confianza}% -{" "}
                {ocrData.camposExtraidos.length} campos extraídos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Campos Extraídos:</h4>
                <div className="flex flex-wrap gap-2">
                  {ocrData.camposExtraidos.map((campo, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {campo}
                    </Badge>
                  ))}
                </div>
              </div>

              {ocrData.camposFaltantes.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Campos Faltantes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {ocrData.camposFaltantes.map((campo, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-orange-600 border-orange-600"
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {campo}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={aplicarDatosOCR} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aplicar Datos
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowOCRResults(null)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cerrar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
