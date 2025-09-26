"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Archive, 
  Search, 
  Download, 
  Eye, 
  Calendar,
  FileText,
  User,
  Building
} from "lucide-react";
import { ExpedienteCompraventa, EstadoExpediente } from "@/lib/compraventa-types";

export function ArchivoDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expedientesArchivados, setExpedientesArchivados] = useState<ExpedienteCompraventa[]>([]);
  const [showEscrituraModal, setShowEscrituraModal] = useState(false);
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState<ExpedienteCompraventa | null>(null);
  const licenciadoId = "licenciado-001"; // ID del licenciado por defecto

  // Obtener expedientes archivados desde el estado del kanban
  useEffect(() => {
    const obtenerExpedientesArchivados = () => {
      try {
        // Intentar obtener desde localStorage primero
        const expedientesGuardados = localStorage.getItem('expedientes');
        if (expedientesGuardados) {
          const expedientes: ExpedienteCompraventa[] = JSON.parse(expedientesGuardados);
          const archivados = expedientes.filter(exp => exp.estado === "ARCHIVADO_POST_FIRMA");
          setExpedientesArchivados(archivados);
          return;
        }

        // Si no hay en localStorage, no mostrar expedientes de prueba
        setExpedientesArchivados([]);
      } catch (error) {
        console.error('Error al obtener expedientes archivados:', error);
      }
    };

    obtenerExpedientesArchivados();
    
    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      obtenerExpedientesArchivados();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar cambios en el mismo tab
    const interval = setInterval(obtenerExpedientesArchivados, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Filtrar expedientes por término de búsqueda
  const expedientesFiltrados = expedientesArchivados.filter(expediente => {
    const searchLower = searchTerm.toLowerCase();
    return (
      expediente.numeroSolicitud.toLowerCase().includes(searchLower) ||
      expediente.comprador.nombre.toLowerCase().includes(searchLower) ||
      expediente.comprador.apellidoPaterno.toLowerCase().includes(searchLower) ||
      expediente.vendedor.nombre.toLowerCase().includes(searchLower) ||
      expediente.vendedor.apellidoPaterno.toLowerCase().includes(searchLower) ||
      (expediente.tipoTramite || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Archivo de Expedientes</h2>
          <p className="text-gray-600">Consulta expedientes archivados</p>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre de cliente, número de solicitud o tipo de trámite..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de Expedientes Archivados */}
      {expedientesFiltrados.length > 0 ? (
        <div className="grid gap-3">
          {expedientesFiltrados.map((expediente) => (
            <Card key={expediente.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-blue-900">
                        {expediente.numeroSolicitud}
                      </h3>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                        Archivado
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-white text-blue-600 border-blue-300">
                        {(expediente.tipoTramite || "compraventa").charAt(0).toUpperCase() + (expediente.tipoTramite || "compraventa").slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-blue-700">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span><strong>Comprador:</strong> {expediente.comprador.nombre} {expediente.comprador.apellidoPaterno}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span><strong>Vendedor:</strong> {expediente.vendedor.nombre} {expediente.vendedor.apellidoPaterno}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span><strong>Archivado:</strong> {new Date().toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 bg-white text-blue-600 border-blue-300 hover:bg-blue-50 text-xs h-7 px-3"
                      onClick={() => {
                        setExpedienteSeleccionado(expediente);
                        setShowEscrituraModal(true);
                      }}
                    >
                      <Eye className="h-3 w-3" />
                      Ver Escritura
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 bg-white text-blue-600 border-blue-300 hover:bg-blue-50 text-xs h-7 px-3"
                    >
                      <Download className="h-3 w-3" />
                      Descargar
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
              <Archive className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              {searchTerm ? "No se encontraron expedientes" : "No hay expedientes archivados"}
            </h3>
            <p className="text-blue-600">
              {searchTerm 
                ? "Intenta con otros términos de búsqueda"
                : "Los expedientes aparecerán aquí una vez que hayan sido archivados desde la sección de Post Firma."
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Escritura Final */}
      <Dialog open={showEscrituraModal} onOpenChange={setShowEscrituraModal}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0 !max-w-7xl">
          <DialogHeader className="flex-shrink-0 pb-1 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 pl-6">
            <DialogTitle className="text-base text-blue-900">
              Escritura Final - {expedienteSeleccionado?.numeroSolicitud}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            <div className="h-[calc(95vh-80px)] w-full">
              <iframe
                src="/Escrituras dummy.pdf"
                className="w-full h-full border-0"
                title="Escritura Final"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}