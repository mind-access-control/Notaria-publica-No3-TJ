"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Archive, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  FileText,
  User,
  Building
} from "lucide-react";

interface ExpedienteArchivado {
  id: string;
  numeroSolicitud: string;
  cliente: string;
  tipo: string;
  fechaArchivado: string;
  fechaCompletado: string;
  ubicacion: string;
  estado: "archivado" | "digitalizado";
}

const expedientesArchivadosMock: ExpedienteArchivado[] = [
  {
    id: "1",
    numeroSolicitud: "SOL-2024-001",
    cliente: "María González",
    tipo: "Compraventa",
    fechaArchivado: "2024-08-15",
    fechaCompletado: "2024-08-10",
    ubicacion: "Archivo Físico - Estante A-15",
    estado: "archivado"
  },
  {
    id: "2",
    numeroSolicitud: "SOL-2024-002",
    cliente: "Carlos Rodríguez",
    tipo: "Poder Notarial",
    fechaArchivado: "2024-08-20",
    fechaCompletado: "2024-08-18",
    ubicacion: "Archivo Digital - Carpeta 2024",
    estado: "digitalizado"
  },
  {
    id: "3",
    numeroSolicitud: "SOL-2024-003",
    cliente: "Ana Martínez",
    tipo: "Testamento",
    fechaArchivado: "2024-09-01",
    fechaCompletado: "2024-08-28",
    ubicacion: "Archivo Físico - Estante B-08",
    estado: "archivado"
  }
];

export function ArchivoDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("todos");
  const [filterEstado, setFilterEstado] = useState<string>("todos");

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "archivado":
        return "bg-blue-100 text-blue-800";
      case "digitalizado":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "archivado":
        return "Archivado";
      case "digitalizado":
        return "Digitalizado";
      default:
        return estado;
    }
  };

  const filteredExpedientes = expedientesArchivadosMock.filter(expediente => {
    const matchesSearch = expediente.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expediente.numeroSolicitud.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expediente.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "todos" || expediente.tipo === filterTipo;
    const matchesEstado = filterEstado === "todos" || expediente.estado === filterEstado;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Archivo de Expedientes</h2>
          <p className="text-gray-600">Gestiona expedientes completados y archivados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar Lista
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Archivados</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {expedientesArchivadosMock.length}
            </div>
            <p className="text-xs text-muted-foreground">Expedientes completados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Digitalizados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {expedientesArchivadosMock.filter(e => e.estado === "digitalizado").length}
            </div>
            <p className="text-xs text-muted-foreground">Disponibles digitalmente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Físicos</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {expedientesArchivadosMock.filter(e => e.estado === "archivado").length}
            </div>
            <p className="text-xs text-muted-foreground">En archivo físico</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por cliente, número o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los tipos</option>
              <option value="Compraventa">Compraventa</option>
              <option value="Poder Notarial">Poder Notarial</option>
              <option value="Testamento">Testamento</option>
            </select>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los estados</option>
              <option value="archivado">Archivado</option>
              <option value="digitalizado">Digitalizado</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Expedientes Archivados */}
      <div className="grid gap-4">
        {filteredExpedientes.map((expediente) => (
          <Card key={expediente.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {expediente.numeroSolicitud}
                    </h3>
                    <Badge className={getEstadoColor(expediente.estado)}>
                      {getEstadoLabel(expediente.estado)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{expediente.cliente}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{expediente.tipo}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Completado: {new Date(expediente.fechaCompletado).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Archive className="h-4 w-4" />
                      <span>Archivado: {new Date(expediente.fechaArchivado).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">
                      <strong>Ubicación:</strong> {expediente.ubicacion}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Descargar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExpedientes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay expedientes archivados</h3>
            <p className="text-gray-500">
              {searchTerm || filterTipo !== "todos" || filterEstado !== "todos"
                ? "No se encontraron expedientes con los filtros aplicados"
                : "No tienes expedientes archivados en este momento"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
