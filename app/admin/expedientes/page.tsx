"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Users,
  Calendar,
  DollarSign,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Filter,
  Download,
  Send,
  Archive,
  ArrowLeft,
} from "lucide-react";

// Mock data para expedientes
const expedientesMock = [
  {
    id: "EXP-001",
    cliente: "Juan Pérez García",
    tramite: "Testamento",
    estado: "En revisión",
    progreso: 75,
    fechaCreacion: "2024-01-15",
    ultimaActividad: "2024-01-20",
    documentos: 8,
    totalDocumentos: 10,
    costos: {
      total: 3300,
      pagado: 3300,
      pendiente: 0,
    },
    cita: {
      fecha: "2024-01-25",
      hora: "10:00",
      notario: "Dr. Roberto Notario",
      estado: "Programada",
    },
  },
  {
    id: "EXP-002",
    cliente: "Ana Martínez Ruiz",
    tramite: "Compraventa",
    estado: "Completado",
    progreso: 100,
    fechaCreacion: "2024-01-10",
    ultimaActividad: "2024-01-18",
    documentos: 6,
    totalDocumentos: 6,
    costos: {
      total: 2500,
      pagado: 2500,
      pendiente: 0,
    },
    cita: {
      fecha: "2024-01-18",
      hora: "14:00",
      notario: "Dr. Roberto Notario",
      estado: "Completada",
    },
  },
  {
    id: "EXP-003",
    cliente: "Roberto Silva",
    tramite: "Poder",
    estado: "Pendiente",
    progreso: 45,
    fechaCreacion: "2024-01-22",
    ultimaActividad: "2024-01-22",
    documentos: 2,
    totalDocumentos: 4,
    costos: {
      total: 1200,
      pagado: 600,
      pendiente: 600,
    },
    cita: {
      fecha: "2024-01-28",
      hora: "11:00",
      notario: "Lic. Ana García",
      estado: "Pendiente",
    },
  },
  {
    id: "EXP-004",
    cliente: "María González",
    tramite: "Donación",
    estado: "En revisión",
    progreso: 60,
    fechaCreacion: "2024-01-20",
    ultimaActividad: "2024-01-23",
    documentos: 5,
    totalDocumentos: 8,
    costos: {
      total: 1800,
      pagado: 1800,
      pendiente: 0,
    },
    cita: {
      fecha: "2024-01-26",
      hora: "15:00",
      notario: "Dr. Roberto Notario",
      estado: "Programada",
    },
  },
  {
    id: "EXP-005",
    cliente: "Carlos López",
    tramite: "Fideicomiso",
    estado: "Pendiente",
    progreso: 30,
    fechaCreacion: "2024-01-24",
    ultimaActividad: "2024-01-24",
    documentos: 1,
    totalDocumentos: 12,
    costos: {
      total: 5000,
      pagado: 1500,
      pendiente: 3500,
    },
    cita: {
      fecha: "2024-01-30",
      hora: "09:00",
      notario: "Lic. Ana García",
      estado: "Pendiente",
    },
  },
];

export default function ExpedientesPage() {
  const router = useRouter();
  const [expedientes, setExpedientes] = useState(expedientesMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterTramite, setFilterTramite] = useState("todos");
  const [activeTab, setActiveTab] = useState("todos");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExpediente, setSelectedExpediente] = useState<any>(null);
  const [newExpediente, setNewExpediente] = useState({
    cliente: "",
    tramite: "",
    telefono: "",
    email: "",
  });

  // Filtrar expedientes
  const filteredExpedientes = expedientes.filter((expediente) => {
    const matchesSearch =
      expediente.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expediente.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado =
      filterEstado === "todos" || expediente.estado === filterEstado;
    const matchesTramite =
      filterTramite === "todos" || expediente.tramite === filterTramite;

    return matchesSearch && matchesEstado && matchesTramite;
  });

  // Agrupar por estado para tabs
  const expedientesPorEstado = {
    todos: filteredExpedientes,
    pendientes: expedientes.filter((e) => e.estado === "Pendiente"),
    enRevision: expedientes.filter((e) => e.estado === "En revisión"),
    completados: expedientes.filter((e) => e.estado === "Completado"),
  };

  const handleVerExpediente = (expediente: any) => {
    router.push(`/admin/expedientes/${expediente.id}`);
  };

  const handleEliminarExpediente = (expediente: any) => {
    setSelectedExpediente(expediente);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedExpediente) {
      setExpedientes((prev) =>
        prev.filter((e) => e.id !== selectedExpediente.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedExpediente(null);
    }
  };

  const handleCreateExpediente = () => {
    if (newExpediente.cliente && newExpediente.tramite) {
      const nuevoExpediente = {
        id: `EXP-${String(expedientes.length + 1).padStart(3, "0")}`,
        cliente: newExpediente.cliente,
        tramite: newExpediente.tramite,
        estado: "Pendiente",
        progreso: 0,
        fechaCreacion: new Date().toISOString().split("T")[0],
        ultimaActividad: new Date().toISOString().split("T")[0],
        documentos: 0,
        totalDocumentos: 8,
        costos: {
          total: 0,
          pagado: 0,
          pendiente: 0,
        },
        cita: {
          fecha: "",
          hora: "",
          notario: "",
          estado: "Sin programar",
        },
      };

      setExpedientes((prev) => [nuevoExpediente, ...prev]);
      setNewExpediente({ cliente: "", tramite: "", telefono: "", email: "" });
      setIsCreateModalOpen(false);
    }
  };

  const handleArchivar = (expediente: any) => {
    setExpedientes((prev) =>
      prev.map((e) =>
        e.id === expediente.id ? { ...e, estado: "Archivado" } : e
      )
    );
  };

  const tramitesDisponibles = [
    "Testamento",
    "Compraventa",
    "Poder",
    "Donación",
    "Fideicomiso",
    "Sociedad",
    "Hipoteca",
    "Permuta",
    "Adjudicación",
    "Otro",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Expedientes
          </h1>
          <p className="text-gray-600">
            Administra todos los expedientes notariales
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al Dashboard</span>
          </Button>
          <Button
            onClick={() => router.push("/admin/expedientes/nuevo")}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Expediente</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expedientes
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expedientes.length}</div>
            <p className="text-xs text-muted-foreground">
              {expedientes.filter((e) => e.estado === "Completado").length}{" "}
              completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {expedientes.filter((e) => e.estado === "Pendiente").length}
            </div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Revisión</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {expedientes.filter((e) => e.estado === "En revisión").length}
            </div>
            <p className="text-xs text-muted-foreground">En proceso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {expedientes.filter((e) => e.estado === "Completado").length}
            </div>
            <p className="text-xs text-muted-foreground">Finalizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por cliente o ID de expediente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En revisión">En revisión</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTramite} onValueChange={setFilterTramite}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trámite" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los trámites</SelectItem>
                  {tramitesDisponibles.map((tramite) => (
                    <SelectItem key={tramite} value={tramite}>
                      {tramite}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Estados */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todos">
            Todos ({expedientesPorEstado.todos.length})
          </TabsTrigger>
          <TabsTrigger value="pendientes">
            Pendientes ({expedientesPorEstado.pendientes.length})
          </TabsTrigger>
          <TabsTrigger value="enRevision">
            En Revisión ({expedientesPorEstado.enRevision.length})
          </TabsTrigger>
          <TabsTrigger value="completados">
            Completados ({expedientesPorEstado.completados.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {expedientesPorEstado[
              activeTab as keyof typeof expedientesPorEstado
            ].map((expediente) => (
              <Card
                key={expediente.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {expediente.cliente}
                        </h3>
                        <Badge
                          variant={
                            expediente.estado === "Completado"
                              ? "default"
                              : expediente.estado === "En revisión"
                              ? "secondary"
                              : expediente.estado === "Archivado"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {expediente.estado}
                        </Badge>
                        <Badge variant="outline">{expediente.tramite}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">ID Expediente</p>
                          <p className="font-medium">{expediente.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Progreso</p>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={expediente.progreso}
                              className="w-20 h-2"
                            />
                            <span className="text-sm font-medium">
                              {expediente.progreso}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Documentos</p>
                          <p className="font-medium">
                            {expediente.documentos}/{expediente.totalDocumentos}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Costo Total</p>
                          <p className="font-medium">
                            ${expediente.costos.total.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span>Creación: {expediente.fechaCreacion}</span>
                          <span>
                            Última actividad: {expediente.ultimaActividad}
                          </span>
                        </div>
                        {expediente.cita.fecha && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {expediente.cita.fecha} {expediente.cita.hora}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerExpediente(expediente)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleArchivar(expediente)}
                      >
                        <Archive className="h-4 w-4 mr-1" />
                        Archivar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleEliminarExpediente(expediente)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {expedientesPorEstado[
              activeTab as keyof typeof expedientesPorEstado
            ].length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay expedientes
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === "todos"
                      ? "No se encontraron expedientes con los filtros aplicados"
                      : `No hay expedientes en estado "${activeTab}"`}
                  </p>
                  <Button
                    onClick={() => router.push("/admin/expedientes/nuevo")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primer Expediente
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal para Crear Expediente Rápido */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Expediente Rápido</DialogTitle>
            <DialogDescription>
              Crea un expediente básico que podrás completar después
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                value={newExpediente.cliente}
                onChange={(e) =>
                  setNewExpediente((prev) => ({
                    ...prev,
                    cliente: e.target.value,
                  }))
                }
                placeholder="Nombre del cliente"
              />
            </div>
            <div>
              <Label htmlFor="tramite">Trámite</Label>
              <Select
                value={newExpediente.tramite}
                onValueChange={(value) =>
                  setNewExpediente((prev) => ({ ...prev, tramite: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un trámite" />
                </SelectTrigger>
                <SelectContent>
                  {tramitesDisponibles.map((tramite) => (
                    <SelectItem key={tramite} value={tramite}>
                      {tramite}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono (opcional)</Label>
              <Input
                id="telefono"
                value={newExpediente.telefono}
                onChange={(e) =>
                  setNewExpediente((prev) => ({
                    ...prev,
                    telefono: e.target.value,
                  }))
                }
                placeholder="Teléfono de contacto"
              />
            </div>
            <div>
              <Label htmlFor="email">Email (opcional)</Label>
              <Input
                id="email"
                type="email"
                value={newExpediente.email}
                onChange={(e) =>
                  setNewExpediente((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="Correo electrónico"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateExpediente}>Crear Expediente</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Confirmar Eliminación */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este expediente? Esta acción
              no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {selectedExpediente && (
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="font-medium text-red-900">
                Expediente: {selectedExpediente.id}
              </p>
              <p className="text-red-700">
                Cliente: {selectedExpediente.cliente}
              </p>
              <p className="text-red-700">
                Trámite: {selectedExpediente.tramite}
              </p>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar Expediente
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
