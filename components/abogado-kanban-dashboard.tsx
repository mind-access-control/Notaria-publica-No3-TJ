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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  Filter,
  Search,
  User,
  Home,
  DollarSign,
  Calendar,
  MoreHorizontal,
  Plus,
  Edit3,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Send,
  Shield,
  TrendingUp,
  Users,
  Building,
} from "lucide-react";
import {
  ExpedienteCompraventa,
  EstadoExpediente,
  ESTADOS_FLUJO,
  getExpedientesByEstado,
  getExpedientesByAbogado,
  updateExpedienteEstado,
  addComentarioExpediente,
} from "@/lib/expedientes-data";
import { expedientesMock } from "@/lib/expedientes-data";

interface AbogadoKanbanDashboardProps {
  abogadoId: string;
}

interface KanbanColumn {
  id: EstadoExpediente;
  title: string;
  color: string;
  icon: React.ReactNode;
}

const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: "RECIBIDO",
    title: "Recibido",
    color: "bg-blue-50 border-blue-200",
    icon: <FileText className="h-4 w-4 text-blue-600" />,
  },
  {
    id: "EN_VALIDACION",
    title: "En Validación",
    color: "bg-yellow-50 border-yellow-200",
    icon: <Clock className="h-4 w-4 text-yellow-600" />,
  },
  {
    id: "EN_PREPARACION",
    title: "En Preparación",
    color: "bg-orange-50 border-orange-200",
    icon: <Edit3 className="h-4 w-4 text-orange-600" />,
  },
  {
    id: "LISTO_PARA_FIRMA",
    title: "Listo para Firma",
    color: "bg-green-50 border-green-200",
    icon: <CheckCircle className="h-4 w-4 text-green-600" />,
  },
  {
    id: "COMPLETADO",
    title: "Completado",
    color: "bg-emerald-50 border-emerald-200",
    icon: <Shield className="h-4 w-4 text-emerald-600" />,
  },
];

const TRAMITE_TYPES = [
  {
    id: "todos",
    name: "Todos",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "compraventas",
    name: "Compraventas",
    icon: <Home className="h-4 w-4" />,
  },
  {
    id: "testamentos",
    name: "Testamentos",
    icon: <FileText className="h-4 w-4" />,
  },
  { id: "donaciones", name: "Donaciones", icon: <Users className="h-4 w-4" /> },
  { id: "permutas", name: "Permutas", icon: <Building className="h-4 w-4" /> },
  {
    id: "creditos_hipotecarios",
    name: "Créditos Hipotecarios",
    icon: <DollarSign className="h-4 w-4" />,
  },
  { id: "poderes", name: "Poderes", icon: <Shield className="h-4 w-4" /> },
  {
    id: "otros",
    name: "Otros",
    icon: <FileText className="h-4 w-4" />,
    submenu: [
      {
        id: "mutuo",
        name: "Contrato de Mutuo",
        icon: <DollarSign className="h-3 w-3" />,
      },
      {
        id: "adeudo",
        name: "Reconocimiento de Adeudo",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "adjudicaciones_hereditarias",
        name: "Adjudicaciones Hereditarias",
        icon: <Users className="h-3 w-3" />,
      },
      {
        id: "adjudicaciones",
        name: "Adjudicaciones",
        icon: <Building className="h-3 w-3" />,
      },
      {
        id: "sociedades",
        name: "Constitución de Sociedades",
        icon: <Building className="h-3 w-3" />,
      },
      {
        id: "liquidacion_copropiedad",
        name: "Liquidación de Copropiedad",
        icon: <Building className="h-3 w-3" />,
      },
      {
        id: "cesion_derechos",
        name: "Cesión de Derechos",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "servidumbre",
        name: "Constitución de Servidumbre",
        icon: <Building className="h-3 w-3" />,
      },
      {
        id: "convenios_modificatorios",
        name: "Convenios Modificatorios",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "elevacion_judicial",
        name: "Elevación judicial a escritura pública",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "dacion_pago",
        name: "Dación en pago",
        icon: <DollarSign className="h-3 w-3" />,
      },
      {
        id: "formalizacion_contrato",
        name: "Formalización de contrato privado",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "fideicomisos",
        name: "Fideicomisos",
        icon: <Shield className="h-3 w-3" />,
      },
      {
        id: "inicio_sucesion",
        name: "Inicio de Sucesión",
        icon: <Users className="h-3 w-3" />,
      },
      {
        id: "cancelacion_hipoteca",
        name: "Cancelación de Hipoteca",
        icon: <DollarSign className="h-3 w-3" />,
      },
      {
        id: "protocolizacion_acta",
        name: "Protocolización de Acta de Asamblea",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "cambio_regimen_matrimonial",
        name: "Cambio de Régimen Matrimonial",
        icon: <Users className="h-3 w-3" />,
      },
      {
        id: "cotejos",
        name: "Cotejos",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "fe_hechos",
        name: "Fe de Hechos",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "rectificacion_escrituras",
        name: "Rectificación de Escrituras",
        icon: <FileText className="h-3 w-3" />,
      },
    ],
  },
];

export function AbogadoKanbanDashboard({
  abogadoId,
}: AbogadoKanbanDashboardProps) {
  const [expedientes, setExpedientes] = useState<ExpedienteCompraventa[]>([]);
  const [filteredExpedientes, setFilteredExpedientes] = useState<
    ExpedienteCompraventa[]
  >([]);
  const [selectedTramiteType, setSelectedTramiteType] =
    useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpediente, setSelectedExpediente] =
    useState<ExpedienteCompraventa | null>(null);
  const [showExpedienteModal, setShowExpedienteModal] = useState(false);
  const [showComentarioModal, setShowComentarioModal] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [tipoComentario, setTipoComentario] = useState<
    "general" | "observacion" | "requerimiento"
  >("general");
  const [draggedExpediente, setDraggedExpediente] = useState<string | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [showSubmenu, setShowSubmenu] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState<{
    expediente: ExpedienteCompraventa | null;
    saldoPendiente: number;
    total: number;
  }>({ expediente: null, saldoPendiente: 0, total: 0 });

  useEffect(() => {
    // Cargar expedientes del abogado
    const expedientesAbogado = getExpedientesByAbogado(abogadoId);
    setExpedientes(expedientesAbogado);
    setFilteredExpedientes(expedientesAbogado);
  }, [abogadoId]);

  useEffect(() => {
    // Filtrar expedientes
    let filtered = expedientes;

    // Filtrar por tipo de trámite
    if (selectedTramiteType !== "todos") {
      filtered = filtered.filter((exp) => {
        return exp.tipoTramite === selectedTramiteType;
      });
    }
    // Si es "todos", no filtrar por tipo

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (exp) =>
          exp.numeroSolicitud
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          exp.comprador.nombre
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          exp.comprador.apellidoPaterno
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          exp.vendedor.nombre
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          exp.vendedor.apellidoPaterno
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar por fecha
    filtered.sort((a, b) => {
      const dateA = new Date(a.fechaUltimaActualizacion).getTime();
      const dateB = new Date(b.fechaUltimaActualizacion).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredExpedientes(filtered);
  }, [expedientes, selectedTramiteType, searchTerm, sortOrder]);

  const handleDragStart = (e: React.DragEvent, expedienteId: string) => {
    setDraggedExpediente(expedienteId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, nuevoEstado: EstadoExpediente) => {
    e.preventDefault();

    if (!draggedExpediente) return;

    // Validar si se puede mover a "LISTO_PARA_FIRMA"
    if (nuevoEstado === "LISTO_PARA_FIRMA") {
      const expediente = expedientes.find(
        (exp) => exp.id === draggedExpediente
      );
      if (!expediente) return;

      // Verificar si el pago está completo
      const pagoCompleto = expediente.costos.saldoPendiente === 0;
      if (!pagoCompleto) {
        // Mostrar modal de pago pendiente
        setPaymentModalData({
          expediente: expediente,
          saldoPendiente: expediente.costos.saldoPendiente,
          total: expediente.costos.total,
        });
        setShowPaymentModal(true);
        setDraggedExpediente(null);
        return;
      }
    }

    // Actualizar estado del expediente
    const success = updateExpedienteEstado(
      draggedExpediente,
      nuevoEstado,
      abogadoId
    );

    if (success) {
      // Refrescar expedientes desde el backend para obtener el historial actualizado
      const expedientesActualizados = getExpedientesByAbogado(abogadoId);
      setExpedientes(expedientesActualizados);
    }

    setDraggedExpediente(null);
  };

  const handleExpedienteClick = (expediente: ExpedienteCompraventa) => {
    setSelectedExpediente(expediente);
    setShowExpedienteModal(true);
  };

  const handleAddComentario = () => {
    if (!selectedExpediente || !nuevoComentario.trim()) return;

    const success = addComentarioExpediente(
      selectedExpediente.id,
      nuevoComentario,
      abogadoId,
      tipoComentario
    );

    if (success) {
      // Actualizar estado local - solo actualizar desde los datos mock
      const expedienteActualizado = expedientesMock.find(
        (exp) => exp.id === selectedExpediente.id
      );
      if (expedienteActualizado) {
        setExpedientes((prev) =>
          prev.map((exp) =>
            exp.id === selectedExpediente.id ? expedienteActualizado : exp
          )
        );

        setSelectedExpediente(expedienteActualizado);
      }

      setNuevoComentario("");
      setShowComentarioModal(false);
    }
  };

  const getExpedientesByColumn = (estado: EstadoExpediente) => {
    return filteredExpedientes.filter(
      (exp: ExpedienteCompraventa) => exp.estado === estado
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderExpedienteCard = (expediente: ExpedienteCompraventa) => {
    const documentosCompletados = expediente.documentos.filter(
      (doc: any) => doc.estado === "validado"
    ).length;
    const totalDocumentos = expediente.documentos.length;
    const progresoDocumentos =
      totalDocumentos > 0 ? (documentosCompletados / totalDocumentos) * 100 : 0;

    // Calcular estado del pago
    const pagoCompleto = expediente.costos.saldoPendiente === 0;
    const tienePagosParciales = expediente.pagos.length > 0;

    return (
      <Card
        key={expediente.id}
        className="cursor-pointer hover:shadow-md transition-shadow mb-3"
        draggable
        onDragStart={(e) => handleDragStart(e, expediente.id)}
        onClick={() => handleExpedienteClick(expediente)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-sm font-medium text-gray-900">
                {expediente.numeroSolicitud}
              </CardTitle>
              <CardDescription className="text-xs text-gray-600 mt-1">
                {expediente.comprador.nombre}{" "}
                {expediente.comprador.apellidoPaterno}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className="text-xs">
                {formatCurrency(expediente.costos.total)}
              </Badge>
              {pagoCompleto ? (
                <Badge className="bg-green-100 text-green-800 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Pagado
                </Badge>
              ) : tienePagosParciales ? (
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Parcial
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Pendiente
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Home className="h-3 w-3" />
              <span>
                {expediente.inmueble.tipo} - {expediente.inmueble.superficie}m²
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600">
              <FileText className="h-3 w-3" />
              <span>
                {documentosCompletados}/{totalDocumentos} documentos
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progresoDocumentos}%` }}
              />
            </div>

            {!pagoCompleto && (
              <div className="flex items-center gap-2 text-xs text-red-600">
                <DollarSign className="h-3 w-3" />
                <span>
                  Saldo: {formatCurrency(expediente.costos.saldoPendiente)}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500 pt-1 border-t border-gray-100">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(expediente.fechaUltimaActualizacion)}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatDate(expediente.fechaCreacion)}</span>
              {expediente.comentarios.length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{expediente.comentarios.length}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderExpedienteModal = () => {
    if (!selectedExpediente) return null;

    return (
      <Dialog open={showExpedienteModal} onOpenChange={setShowExpedienteModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Expediente {selectedExpediente.numeroSolicitud}
            </DialogTitle>
            <DialogDescription>
              Compraventa de {selectedExpediente.inmueble.tipo} -{" "}
              {selectedExpediente.inmueble.superficie}m²
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 pr-2">
            <Tabs defaultValue="informacion" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="informacion">Información</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
                <TabsTrigger value="pagos">Pagos</TabsTrigger>
                <TabsTrigger value="historial">Historial</TabsTrigger>
              </TabsList>

              <TabsContent value="informacion" className="space-y-6">
                {/* Información general */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Información General
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Comprador
                        </Label>
                        <p className="text-sm">
                          {selectedExpediente.comprador.nombre}{" "}
                          {selectedExpediente.comprador.apellidoPaterno}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Vendedor
                        </Label>
                        <p className="text-sm">
                          {selectedExpediente.vendedor.nombre}{" "}
                          {selectedExpediente.vendedor.apellidoPaterno}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Valor de Venta
                        </Label>
                        <p className="text-sm font-medium text-emerald-600">
                          {formatCurrency(
                            selectedExpediente.inmueble.valorVenta
                          )}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Costo Total
                        </Label>
                        <p className="text-sm font-medium">
                          {formatCurrency(selectedExpediente.costos.total)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comentarios */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Comentarios</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSortOrder(
                              sortOrder === "newest" ? "oldest" : "newest"
                            )
                          }
                          className="flex items-center gap-2"
                        >
                          {sortOrder === "newest" ? (
                            <>
                              <ArrowDown className="h-3 w-3" />
                              Más reciente
                            </>
                          ) : (
                            <>
                              <ArrowUp className="h-3 w-3" />
                              Más antiguo
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setShowComentarioModal(true)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedExpediente.comentarios
                        .sort((a: any, b: any) => {
                          const dateA = new Date(a.fecha).getTime();
                          const dateB = new Date(b.fecha).getTime();
                          return sortOrder === "newest"
                            ? dateB - dateA
                            : dateA - dateB;
                        })
                        .map((comentario: any) => (
                          <div
                            key={comentario.id}
                            className="p-3 border rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                {comentario.usuario}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(comentario.fecha)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {comentario.comentario}
                            </p>
                            <Badge variant="outline" className="text-xs mt-2">
                              {comentario.tipo}
                            </Badge>
                          </div>
                        ))}
                      {selectedExpediente.comentarios.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No hay comentarios aún
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documentos" className="space-y-6">
                {/* Documentos */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Documentos</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSortOrder(
                            sortOrder === "newest" ? "oldest" : "newest"
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        {sortOrder === "newest" ? (
                          <>
                            <ArrowDown className="h-3 w-3" />
                            Más reciente
                          </>
                        ) : (
                          <>
                            <ArrowUp className="h-3 w-3" />
                            Más antiguo
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedExpediente.documentos
                        .sort((a: any, b: any) => {
                          const dateA = new Date(a.fechaSubida).getTime();
                          const dateB = new Date(b.fechaSubida).getTime();
                          return sortOrder === "newest"
                            ? dateB - dateA
                            : dateA - dateB;
                        })
                        .map((doc: any) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-600" />
                              <span className="text-sm">{doc.nombre}</span>
                            </div>
                            <Badge
                              variant={
                                doc.estado === "validado"
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                doc.estado === "validado"
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }
                            >
                              {doc.estado}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pagos" className="space-y-6">
                {/* Pagos */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                        Estado de Pagos
                      </CardTitle>
                      {selectedExpediente.pagos.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSortOrder(
                              sortOrder === "newest" ? "oldest" : "newest"
                            )
                          }
                          className="flex items-center gap-2"
                        >
                          {sortOrder === "newest" ? (
                            <>
                              <ArrowDown className="h-3 w-3" />
                              Más reciente
                            </>
                          ) : (
                            <>
                              <ArrowUp className="h-3 w-3" />
                              Más antiguo
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Total Requerido
                          </Label>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(selectedExpediente.costos.total)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Saldo Pendiente
                          </Label>
                          <p
                            className={`text-lg font-semibold ${
                              selectedExpediente.costos.saldoPendiente === 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatCurrency(
                              selectedExpediente.costos.saldoPendiente
                            )}
                          </p>
                        </div>
                      </div>

                      {selectedExpediente.pagos.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600 mb-2 block">
                            Historial de Pagos
                          </Label>
                          <div className="space-y-2">
                            {selectedExpediente.pagos
                              .sort((a: any, b: any) => {
                                const dateA = new Date(a.fecha).getTime();
                                const dateB = new Date(b.fecha).getTime();
                                return sortOrder === "newest"
                                  ? dateB - dateA
                                  : dateA - dateB;
                              })
                              .map((pago: any) => (
                                <div
                                  key={pago.id}
                                  className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-3 h-3 rounded-full ${
                                        pago.estado === "confirmado"
                                          ? "bg-green-500"
                                          : pago.estado === "pendiente"
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                      }`}
                                    />
                                    <div>
                                      <p className="text-sm font-medium">
                                        {formatCurrency(pago.monto)}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {formatDate(pago.fecha)} - {pago.metodo}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <Badge
                                      className={
                                        pago.estado === "confirmado"
                                          ? "bg-green-100 text-green-800"
                                          : pago.estado === "pendiente"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                      }
                                    >
                                      {pago.estado}
                                    </Badge>
                                    {pago.referencia && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        Ref: {pago.referencia}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {selectedExpediente.costos.saldoPendiente > 0 && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Pago pendiente:</strong> Este expediente no
                            puede ser movido a "Listo para Firma" hasta que se
                            complete el pago de{" "}
                            {formatCurrency(
                              selectedExpediente.costos.saldoPendiente
                            )}
                            .
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="historial" className="space-y-6">
                {/* Historial */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-emerald-600" />
                        Historial del Expediente
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSortOrder(
                            sortOrder === "newest" ? "oldest" : "newest"
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        {sortOrder === "newest" ? (
                          <>
                            <ArrowDown className="h-3 w-3" />
                            Más reciente
                          </>
                        ) : (
                          <>
                            <ArrowUp className="h-3 w-3" />
                            Más antiguo
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedExpediente.historial
                        .sort((a: any, b: any) => {
                          const dateA = new Date(a.fecha).getTime();
                          const dateB = new Date(b.fecha).getTime();
                          return sortOrder === "newest"
                            ? dateB - dateA
                            : dateA - dateB;
                        })
                        .map((evento: any) => (
                          <div key={evento.id} className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2"></div>
                            </div>
                            <div className="flex-1 pb-4 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {evento.accion}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {formatDate(evento.fecha)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {evento.detalles}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  Por: {evento.usuario}
                                </span>
                                {evento.estadoAnterior &&
                                  evento.estadoNuevo && (
                                    <>
                                      <span className="text-xs text-gray-400">
                                        •
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {evento.estadoAnterior} →{" "}
                                        {evento.estadoNuevo}
                                      </Badge>
                                    </>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderComentarioModal = () => {
    return (
      <Dialog open={showComentarioModal} onOpenChange={setShowComentarioModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Comentario</DialogTitle>
            <DialogDescription>
              Agrega un comentario al expediente{" "}
              {selectedExpediente?.numeroSolicitud}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="tipo-comentario">Tipo de Comentario</Label>
              <Select
                value={tipoComentario}
                onValueChange={(value: any) => setTipoComentario(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="observacion">Observación</SelectItem>
                  <SelectItem value="requerimiento">Requerimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="comentario">Comentario</Label>
              <Textarea
                id="comentario"
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribe tu comentario aquí..."
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddComentario}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Agregar Comentario
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowComentarioModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderPaymentModal = () => {
    return (
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Pago Pendiente
            </DialogTitle>
            <DialogDescription>
              No se puede mover este expediente a "Listo para Firma" porque el
              pago no está completo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {paymentModalData.expediente && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  {paymentModalData.expediente.numeroSolicitud}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total requerido:</span>
                    <span className="font-medium">
                      {formatCurrency(paymentModalData.total)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saldo pendiente:</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(paymentModalData.saldoPendiente)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Acción requerida:</strong> El cliente debe completar el
                pago de {formatCurrency(paymentModalData.saldoPendiente)} antes
                de que este expediente pueda ser movido a "Listo para Firma".
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowPaymentModal(false)}
            >
              Entendido
            </Button>
            <Button
              onClick={() => {
                setShowPaymentModal(false);
                // Aquí se podría abrir el módulo de pagos o contactar al cajero
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Contactar Cajero
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Dashboard Kanban - Abogado
              </CardTitle>
              <CardDescription>
                Gestiona tus expedientes de manera eficiente
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">
                  {filteredExpedientes.length}
                </div>
                <div className="text-sm text-gray-600">Expedientes</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filtro por tipo de trámite */}
            <div className="flex flex-wrap gap-2 relative">
              {TRAMITE_TYPES.map((tipo) => (
                <div key={tipo.id} className="relative">
                  <Button
                    variant={
                      selectedTramiteType === tipo.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      if (tipo.submenu) {
                        setShowSubmenu(
                          showSubmenu === tipo.id ? null : tipo.id
                        );
                      } else {
                        setSelectedTramiteType(tipo.id);
                        setShowSubmenu(null);
                      }
                    }}
                    className={`flex items-center gap-2 text-xs transition-all ${
                      selectedTramiteType === tipo.id
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {tipo.icon}
                    <span className="hidden sm:inline">{tipo.name}</span>
                    {tipo.submenu && (
                      <ArrowDown
                        className={`h-3 w-3 transition-transform ${
                          showSubmenu === tipo.id ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Button>

                  {/* Submenu */}
                  {tipo.submenu && showSubmenu === tipo.id && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-64 max-h-80 overflow-y-auto">
                      <div className="p-2 space-y-1">
                        {tipo.submenu.map((subitem) => (
                          <Button
                            key={subitem.id}
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTramiteType(subitem.id);
                              setShowSubmenu(null);
                            }}
                            className={`w-full justify-start text-xs ${
                              selectedTramiteType === subitem.id
                                ? "bg-emerald-100 text-emerald-700"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            {subitem.icon}
                            <span className="ml-2">{subitem.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número, cliente o vendedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {KANBAN_COLUMNS.map((column) => {
          const expedientesEnColumna = getExpedientesByColumn(column.id);

          return (
            <div
              key={column.id}
              className={`${column.color} rounded-lg border-2 border-dashed p-4 min-h-[500px]`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center gap-2 mb-4">
                {column.icon}
                <h3 className="font-medium text-gray-900">{column.title}</h3>
                <Badge variant="outline" className="ml-auto">
                  {expedientesEnColumna.length}
                </Badge>
              </div>

              <div className="space-y-3">
                {expedientesEnColumna.map((expediente) =>
                  renderExpedienteCard(expediente)
                )}

                {expedientesEnColumna.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay expedientes</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modales */}
      {renderExpedienteModal()}

      {/* Modal de Comentarios */}
      <Dialog open={showComentarioModal} onOpenChange={setShowComentarioModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Comentario</DialogTitle>
            <DialogDescription>
              Agrega un comentario al expediente{" "}
              {selectedExpediente?.numeroSolicitud}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="tipo-comentario">Tipo de Comentario</Label>
              <Select
                value={tipoComentario}
                onValueChange={(value: any) => setTipoComentario(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="observacion">Observación</SelectItem>
                  <SelectItem value="requerimiento">Requerimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="comentario">Comentario</Label>
              <Textarea
                id="comentario"
                placeholder="Escribe tu comentario aquí..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowComentarioModal(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddComentario}>Agregar Comentario</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de pago pendiente */}
      {renderPaymentModal()}
    </div>
  );
}
