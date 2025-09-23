"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Lock,
  Mail,
  Phone,
  Shield,
  AlertCircle,
  Eye,
  EyeOff,
  Chrome,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, isAuthenticated, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [googleUser, setGoogleUser] = useState<any>(null);

  // Estados para login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Estados para registro
  const [registerData, setRegisterData] = useState({
    email: "",
    telefono: "",
    nombre: "",
    password: "",
    confirmPassword: "",
    role: "cliente" as "cliente" | "notario",
  });

  const redirectUrl = searchParams.get("redirect") || "/";
  const tramitePreseleccionado = searchParams.get("tramite");

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Si hay un trámite preseleccionado, agregarlo a la URL de redirección
      const finalRedirectUrl = tramitePreseleccionado
        ? `${redirectUrl}?tramite=${tramitePreseleccionado}`
        : redirectUrl;
      router.push(finalRedirectUrl);
    }
  }, [isAuthenticated, isLoading, router, redirectUrl, tramitePreseleccionado]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Usar la redirección automática del contexto de autenticación
      const response = await login(loginData, redirectUrl);

      if (!response.success) {
        setError(response.error || "Error al iniciar sesión");
      }
      // No necesitamos hacer router.push aquí porque el contexto ya maneja la redirección
    } catch (err) {
      setError("Error interno del servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validaciones
    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsSubmitting(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await register({
        email: registerData.email,
        telefono: registerData.telefono,
        nombre: registerData.nombre,
        password: registerData.password,
        role: registerData.role,
        activo: true,
      });

      if (response.success) {
        router.push(redirectUrl);
      } else {
        setError(response.error || "Error al registrar usuario");
      }
    } catch (err) {
      setError("Error interno del servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para simular SSO de Google
  const handleGoogleSSO = () => {
    // Simular datos de Google (en producción usarías la API real de Google)
    const mockGoogleUser = {
      email: "usuario@gmail.com",
      name: "Usuario Google",
      picture: "https://via.placeholder.com/150",
    };
    
    setGoogleUser(mockGoogleUser);
    setShowProfileModal(true);
  };

  // Función para seleccionar perfil después del SSO
  const handleProfileSelection = async (role: string) => {
    if (!googleUser) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Mapear roles a credenciales existentes del sistema
      const roleCredentials = {
        cliente: { email: "cliente@notaria3tijuana.com", password: "cliente123" },
        licenciado: { email: "licenciado@notaria3tijuana.com", password: "licenciado123" },
        notario: { email: "maria.rodriguez@notaria3tijuana.com", password: "notario123" },
        admin: { email: "admin@notaria3tijuana.com", password: "admin123" }
      };

      const credentials = roleCredentials[role as keyof typeof roleCredentials];
      
      if (!credentials) {
        setError("Tipo de perfil no válido");
        return;
      }

      // Hacer login con las credenciales correspondientes al rol
      const response = await login(credentials, redirectUrl);

      if (!response.success) {
        setError("Error al iniciar sesión con Google");
      }
    } catch (err) {
      setError("Error interno del servidor");
    } finally {
      setIsSubmitting(false);
      setShowProfileModal(false);
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Acceso al Portal
            </h1>
            <p className="text-gray-600">
              {tramitePreseleccionado
                ? "Inicia sesión o regístrate para continuar con tu trámite"
                : "Inicia sesión o regístrate para acceder a tu solicitud"}
            </p>
            {tramitePreseleccionado && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Trámite seleccionado:</strong>{" "}
                  {tramitePreseleccionado.replace("-", " ").toUpperCase()}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Una vez que inicies sesión, podrás continuar con este trámite.
                </p>
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                  <TabsTrigger value="register">Registrarse</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* Formulario de Login */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email o Teléfono</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-email"
                          type="text"
                          placeholder="tu@email.com o +52 664 123 4567"
                          value={loginData.email}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              email: e.target.value,
                            })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Tu contraseña"
                          value={loginData.password}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              password: e.target.value,
                            })
                          }
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>

                    {/* Separador */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">O continúa con</span>
                      </div>
                    </div>

                    {/* Botón de Google SSO */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2 border-blue-600 hover:bg-blue-50 hover:border-blue-700 text-blue-800 font-medium"
                      onClick={handleGoogleSSO}
                      disabled={isSubmitting}
                    >
                      <Chrome className="h-4 w-4 mr-2 text-blue-700" />
                      Continuar con Google
                    </Button>
                  </form>

                  <div className="mt-6">
                    <p className="text-sm text-gray-600 mb-4 text-center">
                      Credenciales de prueba:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setLoginData({
                            email: "cliente@notaria3tijuana.com",
                            password: "cliente123",
                          });
                        }}
                        className="text-xs justify-start"
                      >
                        <User className="h-3 w-3 mr-2" />
                        Cliente: cliente@notaria3tijuana.com
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setLoginData({
                            email: "licenciado@notaria3tijuana.com",
                            password: "licenciado123",
                          });
                        }}
                        className="text-xs justify-start"
                      >
                        <Shield className="h-3 w-3 mr-2" />
                        Licenciado: licenciado@notaria3tijuana.com
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setLoginData({
                            email: "maria.rodriguez@notaria3tijuana.com",
                            password: "notario123",
                          });
                        }}
                        className="text-xs justify-start"
                      >
                        <Shield className="h-3 w-3 mr-2" />
                        Notario: maria.rodriguez@notaria3tijuana.com
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setLoginData({
                            email: "cajero@notaria3tijuana.com",
                            password: "cajero123",
                          });
                        }}
                        className="text-xs justify-start"
                      >
                        <User className="h-3 w-3 mr-2" />
                        Cajero: cajero@notaria3tijuana.com
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setLoginData({
                            email: "admin@notaria3tijuana.com",
                            password: "admin123",
                          });
                        }}
                        className="text-xs justify-start"
                      >
                        <Shield className="h-3 w-3 mr-2" />
                        Admin: admin@notaria3tijuana.com
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Formulario de Registro */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="register-nombre">Nombre Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-nombre"
                          type="text"
                          placeholder="Tu nombre completo"
                          value={registerData.nombre}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              nombre: e.target.value,
                            })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="tu@email.com"
                          value={registerData.email}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              email: e.target.value,
                            })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-telefono">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-telefono"
                          type="tel"
                          placeholder="+52 664 123 4567"
                          value={registerData.telefono}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              telefono: e.target.value,
                            })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-role">Tipo de Usuario</Label>
                      <select
                        id="register-role"
                        value={registerData.role}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            role: e.target.value as "cliente" | "notario",
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      >
                        <option value="cliente">Cliente</option>
                        <option value="notario">Notario/Abogado</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          value={registerData.password}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              password: e.target.value,
                            })
                          }
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">
                        Confirmar Contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-confirm-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Repite tu contraseña"
                          value={registerData.confirmPassword}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registrando..." : "Registrarse"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Modal de Selección de Perfil para SSO */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Chrome className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Selecciona tu perfil
              </h2>
              <p className="text-gray-600 text-sm">
                {googleUser?.name} ({googleUser?.email})
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => handleProfileSelection("cliente")}
                className="w-full justify-start h-auto p-4 bg-white border-2 border-blue-200 hover:bg-blue-900 hover:border-blue-900 hover:shadow-xl transition-all duration-300 group"
                disabled={isSubmitting}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-300">
                    <User className="h-4 w-4 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800 group-hover:text-white transition-colors duration-300">Cliente</p>
                    <p className="text-xs text-gray-600 group-hover:text-blue-200 transition-colors duration-300">Acceso al portal de clientes</p>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => handleProfileSelection("licenciado")}
                className="w-full justify-start h-auto p-4 bg-white border-2 border-blue-300 hover:bg-blue-900 hover:border-blue-900 hover:shadow-xl transition-all duration-300 group"
                disabled={isSubmitting}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-300">
                    <Shield className="h-4 w-4 text-blue-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800 group-hover:text-white transition-colors duration-300">Licenciado</p>
                    <p className="text-xs text-gray-600 group-hover:text-blue-200 transition-colors duration-300">Acceso al dashboard de licenciados</p>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => handleProfileSelection("notario")}
                className="w-full justify-start h-auto p-4 bg-white border-2 border-blue-400 hover:bg-blue-900 hover:border-blue-900 hover:shadow-xl transition-all duration-300 group"
                disabled={isSubmitting}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-300">
                    <Shield className="h-4 w-4 text-blue-800 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800 group-hover:text-white transition-colors duration-300">Notario</p>
                    <p className="text-xs text-gray-600 group-hover:text-blue-200 transition-colors duration-300">Acceso completo del sistema</p>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => handleProfileSelection("admin")}
                className="w-full justify-start h-auto p-4 bg-white border-2 border-blue-500 hover:bg-blue-900 hover:border-blue-900 hover:shadow-xl transition-all duration-300 group"
                disabled={isSubmitting}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-300">
                    <Shield className="h-4 w-4 text-white group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800 group-hover:text-white transition-colors duration-300">Administrador</p>
                    <p className="text-xs text-gray-600 group-hover:text-blue-200 transition-colors duration-300">Acceso administrativo completo</p>
                  </div>
                </div>
              </Button>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowProfileModal(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
