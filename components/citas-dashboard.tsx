"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Search, Plus, Edit3, Eye } from "lucide-react";

interface Cita {
  id: string;
  expedienteId: string;
  cliente: string;
  tipo: string;
  fecha: string;
  hora: string;
  estado: "programada" | "confirmada" | "completada" | "cancelada";
  ubicacion: string;
  notas?: string;
  fechaCreacion: string;
}

export function CitasDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [citas, setCitas] = useState<Cita[]>([]);

  // Cargar citas desde localStorage
  useEffect(() => {
    const cargarCitas = () => {
      const citasGuardadas = localStorage.getItem('citas');
      if (citasGuardadas) {
        setCitas(JSON.parse(citasGuardadas));
      }
    };

    // Cargar citas al montar el componente
    cargarCitas();

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      cargarCitas();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También verificar periódicamente por cambios (para cambios en la misma pestaña)
    const interval = setInterval(cargarCitas, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

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

  const filteredCitas = citas.filter(cita => {
    const matchesSearch = cita.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cita.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cita.fecha.includes(searchTerm) ||
                         cita.hora.includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Citas</h2>
          <p className="text-gray-600">Administra tu agenda y citas con clientes</p>
        </div>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4" />
          Nueva Cita
        </Button>
      </div>

      {/* Búsqueda */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por cliente, tipo de cita o fecha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de Citas */}
      {filteredCitas.length > 0 ? (
        <div className="grid gap-4">
          {filteredCitas.map((cita) => (
            <Card key={cita.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-blue-900">{cita.cliente}</h3>
                      <Badge className={getEstadoColor(cita.estado)}>
                        {getEstadoLabel(cita.estado)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(cita.fecha).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{cita.hora}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span>{cita.ubicacion}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-blue-800">{cita.tipo}</p>
                      {cita.notas && (
                        <p className="text-xs text-blue-600 mt-1">{cita.notas}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1 bg-white text-blue-600 border-blue-300 hover:bg-blue-50 text-xs h-7 px-3"
                    >
                      <Edit3 className="h-3 w-3" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1 bg-white text-blue-600 border-blue-300 hover:bg-blue-50 text-xs h-7 px-3"
                    >
                      <Eye className="h-3 w-3" />
                      Ver
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Estado vacío */
        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              {searchTerm ? "No se encontraron citas" : "No hay citas programadas"}
            </h3>
            <p className="text-blue-600">
              {searchTerm 
                ? "No se encontraron citas que coincidan con tu búsqueda."
                : "Las citas aparecerán aquí una vez que sean programadas desde los expedientes."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}