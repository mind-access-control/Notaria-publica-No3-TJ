"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  FileText, 
  Clock, 
  CheckCircle2, 
  LogOut, 
  Plus,
  Eye,
  AlertCircle,
  Shield
} from "lucide-react";

export default function MiCuentaPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [userSolicitudes, setUserSolicitudes] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/mi-cuenta');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      // Simular obtención de solicitudes del usuario
      const solicitudes = user.role === 'admin' 
        ? ['NT3-2025-00123', 'NT3-2025-00124', 'NT3-2025-00125']
        : user.role === 'notario'
        ? user.solicitudesAsignadas || []
        : ['NT3-2025-00123']; // Cliente ve su solicitud
      
      setUserSolicitudes(solicitudes);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getStatusColor = (estatus: string) => {
    switch (estatus) {
      case 'ARMANDO_EXPEDIENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'EN_REVISION_INTERNA':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BORRADOR_PARA_REVISION_CLIENTE':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'APROBADO_PARA_FIRMA':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'LISTO_PARA_ENTREGA':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETADO':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (estatus: string) => {
    return estatus.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header de la cuenta */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Mi Cuenta
                  </h1>
                  <p className="text-gray-600">
                    Bienvenido, {user.nombre}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {user.role === 'cliente' ? 'Cliente' : 
                     user.role === 'notario' ? 'Notario' : 'Administrador'}
                  </Badge>
                </div>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información del usuario */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nombre</p>
                    <p className="text-gray-900">{user.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Teléfono</p>
                    <p className="text-gray-900">{user.telefono}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tipo de Usuario</p>
                    <Badge className={getStatusColor(user.role.toUpperCase())}>
                      {user.role === 'cliente' ? 'Cliente' : 
                       user.role === 'notario' ? 'Notario' : 'Administrador'}
                    </Badge>
                  </div>
                  {user.ultimoAcceso && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Último Acceso</p>
                      <p className="text-gray-900">
                        {new Date(user.ultimoAcceso).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Solicitudes del usuario */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-600" />
                      {user.role === 'cliente' ? 'Mis Solicitudes' : 
                       user.role === 'notario' ? 'Solicitudes Asignadas' : 'Todas las Solicitudes'}
                    </CardTitle>
                    {user.role === 'cliente' && (
                      <Button 
                        onClick={() => router.push('/')}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Solicitud
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {userSolicitudes.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-4">
                        {user.role === 'cliente' ? 'No tienes solicitudes aún' : 
                         user.role === 'notario' ? 'No tienes solicitudes asignadas' : 
                         'No hay solicitudes en el sistema'}
                      </p>
                      {user.role === 'cliente' && (
                        <Button 
                          onClick={() => router.push('/')}
                          variant="outline"
                        >
                          Crear Primera Solicitud
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userSolicitudes.map((solicitud, index) => (
                        <div 
                          key={solicitud}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <FileText className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{solicitud}</p>
                              <p className="text-sm text-gray-600">
                                {user.role === 'cliente' ? 'Testamento Público Abierto' : 
                                 'Solicitud asignada'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor('ARMANDO_EXPEDIENTE')}>
                              {getStatusText('ARMANDO_EXPEDIENTE')}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => router.push(`/solicitud/${solicitud}`)}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Información adicional según el rol */}
          {user.role === 'notario' && (
            <div className="mt-8">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Como notario, puedes ver y gestionar las solicitudes asignadas a ti. 
                  Contacta al administrador si necesitas acceso a solicitudes adicionales.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {user.role === 'admin' && (
            <div className="mt-8">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Como administrador, tienes acceso completo a todas las solicitudes del sistema. 
                  Puedes gestionar usuarios y configurar el sistema desde el panel de administración.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
