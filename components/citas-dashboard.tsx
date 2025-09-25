"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, MapPin, Plus, Search, Filter } from "lucide-react";

interface Cita {
  id: string;
  cliente: string;
  tipo: string;
  fecha: string;
  hora: string;
  estado: "programada" | "confirmada" | "completada" | "cancelada";
  ubicacion: string;
  notas?: string;
}

const citasMock: Cita[] = [
  {
    id: "1",
    cliente: "María González",
    tipo: "Firma de Escritura",
    fecha: "2025-09-26",
    hora: "10:00",
    estado: "confirmada",
    ubicacion: "Oficina Principal",
    notas: "Traer documentos de identificación"
  },
  {
    id: "2",
    cliente: "Carlos Rodríguez",
    tipo: "Consulta Legal",
    fecha: "2025-09-26",
    hora: "14:30",
    estado: "programada",
    ubicacion: "Oficina Principal"
  },
  {
    id: "3",
    cliente: "Ana Martínez",
    tipo: "Firma de Poder",
    fecha: "2025-09-27",
    hora: "09:00",
    estado: "programada",
    ubicacion: "Oficina Principal"
  }
];

export function CitasDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "bg-green-100 text-green-800";
      case "programada":
        return "bg-blue-100 text-blue-800";
      case "completada":
        return "bg-gray-100 text-gray-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "Confirmada";
      case "programada":
        return "Programada";
      case "completada":
        return "Completada";
      case "cancelada":
        return "Cancelada";
      default:
        return estado;
    }
  };

  const filteredCitas = citasMock.filter(cita => {
    const matchesSearch = cita.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cita.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEstado === "todos" || cita.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Citas</h2>
          <p className="text-gray-600">Administra tu agenda y citas con clientes</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Cita
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por cliente o tipo de cita..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los estados</option>
              <option value="programada">Programada</option>
              <option value="confirmada">Confirmada</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Citas */}
      <div className="grid gap-4">
        {filteredCitas.map((cita) => (
          <Card key={cita.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{cita.cliente}</h3>
                    <Badge className={getEstadoColor(cita.estado)}>
                      {getEstadoLabel(cita.estado)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(cita.fecha).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{cita.hora}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{cita.ubicacion}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700">{cita.tipo}</p>
                    {cita.notas && (
                      <p className="text-sm text-gray-500 mt-1">{cita.notas}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCitas.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay citas</h3>
            <p className="text-gray-500">
              {searchTerm || filterEstado !== "todos" 
                ? "No se encontraron citas con los filtros aplicados"
                : "No tienes citas programadas en este momento"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
