"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSolicitudByNumber, Solicitud } from "@/lib/mock-data";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StatusTracker } from "@/components/status-tracker";
import { PendingActions } from "@/components/pending-actions";
import { SolicitudHistory } from "@/components/solicitud-history";
import { SolicitudHeader } from "@/components/solicitud-header";
import { SolicitudInfo } from "@/components/solicitud-info";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Clock, FileText, Shield, LogIn } from "lucide-react";

export default function SolicitudStatusPage() {
  const params = useParams();
  const router = useRouter();
  const numeroSolicitud = params.numeroSolicitud as string;
  const { user, isAuthenticated, isLoading: authLoading, canAccessSolicitud } = useAuth();
  
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const fetchSolicitud = async () => {
      // Esperar a que termine la autenticación
      if (authLoading) return;
      
      // Si no está autenticado, redirigir al login
      if (!isAuthenticated) {
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      
      // Verificar si el usuario puede acceder a esta solicitud
      if (!canAccessSolicitud(numeroSolicitud)) {
        setAccessDenied(true);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await getSolicitudByNumber(numeroSolicitud);
        
        if (data) {
          setSolicitud(data);
        } else {
          setError("Solicitud no encontrada");
        }
      } catch (err) {
        setError("Error al cargar la solicitud");
        console.error("Error fetching solicitud:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (numeroSolicitud) {
      fetchSolicitud();
    }
  }, [numeroSolicitud, isAuthenticated, authLoading, canAccessSolicitud, router]);

  const handleStatusUpdate = (nuevoEstatus: string) => {
    if (solicitud) {
      setSolicitud({
        ...solicitud,
        estatusActual: nuevoEstatus as any,
        fechaUltimaActualizacion: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleDocumentUpload = (documentoId: number, archivo: File) => {
    if (solicitud) {
      const updatedDocumentos = solicitud.documentosRequeridos.map(doc => 
        doc.id === documentoId 
          ? { 
              ...doc, 
              subido: true, 
              archivo: archivo.name,
              fechaSubida: new Date().toISOString().split('T')[0]
            }
          : doc
      );
      
      setSolicitud({
        ...solicitud,
        documentosRequeridos: updatedDocumentos
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">
                {authLoading ? "Verificando credenciales..." : "Cargando información de la solicitud..."}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20">
          <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Acceso Denegado
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                No tienes permisos para acceder a esta solicitud
              </p>
              
              <Card className="max-w-md mx-auto">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Solicitud: <strong>{numeroSolicitud}</strong>
                      </p>
                      <p className="text-sm text-gray-600 mb-6">
                        Usuario actual: <strong>{user?.nombre}</strong> ({user?.role})
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={() => router.push('/login')}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Cambiar de Usuario
                      </Button>
                      
                      <Button 
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="w-full"
                      >
                        Ir al Inicio
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !solicitud) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "No se pudo cargar la información de la solicitud"}
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header de la solicitud */}
          <SolicitudHeader solicitud={solicitud} />
          
          {/* Información general de la solicitud */}
          <div className="mt-8">
            <SolicitudInfo solicitud={solicitud} />
          </div>

          {/* Tracker de estatus */}
          <div className="mt-8">
            <StatusTracker 
              estatusActual={solicitud.estatusActual}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>

          {/* Acciones pendientes */}
          <div className="mt-8">
            <PendingActions 
              solicitud={solicitud}
              onDocumentUpload={handleDocumentUpload}
            />
          </div>

          {/* Historial de la solicitud */}
          <div className="mt-8">
            <SolicitudHistory solicitud={solicitud} />
          </div>

          {/* Información adicional */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-emerald-600" />
                  <h3 className="text-lg font-semibold">Documentos</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Documentos subidos:</span>
                    <span className="font-medium">
                      {solicitud.documentosRequeridos.filter(doc => doc.subido).length} / {solicitud.documentosRequeridos.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(solicitud.documentosRequeridos.filter(doc => doc.subido).length / solicitud.documentosRequeridos.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">Progreso</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Estatus actual:</span>
                    <span className="font-medium capitalize">
                      {solicitud.estatusActual.replace(/_/g, ' ').toLowerCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Última actualización: {solicitud.fechaUltimaActualizacion}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
