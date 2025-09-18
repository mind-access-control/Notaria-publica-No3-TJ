"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  User,
  Mail,
  Lock,
  Phone,
  Building,
  Shield,
} from "lucide-react";

// Icono de Google (simulado)
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: UserData) => void;
}

interface UserData {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  tipoUsuario: "individual" | "empresarial";
  empresa?: string;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    loginField: "", // Campo unificado para login (email o teléfono)
    password: "",
    confirmPassword: "",
    tipoUsuario: "individual" as "individual" | "empresarial",
    empresa: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showProfileSelection, setShowProfileSelection] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (isLogin) {
      // Para login, validar campo unificado y contraseña
      if (!formData.loginField.trim()) {
        newErrors.loginField = "El correo o teléfono es requerido";
      } else {
        // Verificar si es email o teléfono
        const isEmail = /\S+@\S+\.\S+/.test(formData.loginField);
        const isPhone = /^\d{10}$/.test(formData.loginField.replace(/\D/g, ""));
        
        if (!isEmail && !isPhone) {
          newErrors.loginField = "Ingresa un correo válido o teléfono de 10 dígitos";
        }
      }

      if (!formData.password) {
        newErrors.password = "La contraseña es requerida";
      }
    } else {
      // Para registro, validar todos los campos
      if (!formData.nombre.trim()) {
        newErrors.nombre = "El nombre es requerido";
      }

      if (!formData.email.trim()) {
        newErrors.email = "El email es requerido";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "El email no es válido";
      }

      if (!formData.telefono.trim()) {
        newErrors.telefono = "El teléfono es requerido";
      } else if (!/^\d{10}$/.test(formData.telefono.replace(/\D/g, ""))) {
        newErrors.telefono = "El teléfono debe tener 10 dígitos";
      }

      if (!formData.password) {
        newErrors.password = "La contraseña es requerida";
      } else if (formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }

      if (formData.tipoUsuario === "empresarial" && !formData.empresa.trim()) {
        newErrors.empresa = "El nombre de la empresa es requerido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let userData: UserData;

    if (isLogin) {
      // Para login, determinar si es email o teléfono
      const isEmail = /\S+@\S+\.\S+/.test(formData.loginField);
      
      // Simular datos de usuario existente
      userData = {
        id: "1",
        nombre: "Usuario Demo",
        email: isEmail ? formData.loginField : "demo@email.com",
        telefono: isEmail ? "6641234567" : formData.loginField,
        tipoUsuario: "individual",
      };
    } else {
      // Para registro, usar los datos del formulario
      userData = {
        id: Date.now().toString(),
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        tipoUsuario: formData.tipoUsuario,
        empresa:
          formData.tipoUsuario === "empresarial" ? formData.empresa : undefined,
      };
    }

    // Guardar en localStorage
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");

    setIsLoading(false);
    onLogin(userData);
    onClose();
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    
    try {
      // Simular el proceso de autenticación con Google
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setIsGoogleLoading(false);
      setShowProfileSelection(true);
    } catch (error) {
      console.error("Error en login con Google:", error);
      setIsGoogleLoading(false);
    }
  };

  const handleProfileSelection = (tipoUsuario: "individual" | "empresarial", empresa?: string) => {
    const userData: UserData = {
      id: "google_" + Date.now().toString(),
      nombre: "Usuario Google",
      email: "usuario@gmail.com",
      telefono: "6641234567",
      tipoUsuario: tipoUsuario,
      empresa: empresa,
    };

    // Guardar en localStorage
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");

    onLogin(userData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      loginField: "",
      password: "",
      confirmPassword: "",
      tipoUsuario: "individual",
      empresa: "",
    });
    setErrors({});
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isLogin
              ? "Accede a tu portal privado para gestionar tus trámites"
              : "Crea tu cuenta para acceder a tu portal personal"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={isLogin ? "login" : "register"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger value="register" onClick={() => setIsLogin(false)}>
              Registrarse
            </TabsTrigger>
          </TabsList>

          <TabsContent value={isLogin ? "login" : "register"} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  {isLogin ? "Acceso Seguro" : "Registro Seguro"}
                </CardTitle>
                <CardDescription>
                  {isLogin
                    ? "Ingresa tus datos para acceder a tu portal"
                    : "Completa la información para crear tu cuenta"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isLogin ? (
                    // Para login, solo campo unificado y contraseña
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="loginField">Correo o Teléfono</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="loginField"
                            type="text"
                            placeholder="tu@email.com o 6641234567"
                            value={formData.loginField}
                            onChange={(e) =>
                              handleInputChange("loginField", e.target.value)
                            }
                            className={`pl-10 ${
                              errors.loginField ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {errors.loginField && (
                          <p className="text-sm text-red-500">{errors.loginField}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    // Para registro, todos los campos
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre Completo</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="nombre"
                            type="text"
                            placeholder="Tu nombre completo"
                            value={formData.nombre}
                            onChange={(e) =>
                              handleInputChange("nombre", e.target.value)
                            }
                            className={`pl-10 ${
                              errors.nombre ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {errors.nombre && (
                          <p className="text-sm text-red-500">{errors.nombre}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className={`pl-10 ${
                              errors.email ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="telefono"
                            type="tel"
                            placeholder="6641234567"
                            value={formData.telefono}
                            onChange={(e) =>
                              handleInputChange("telefono", e.target.value)
                            }
                            className={`pl-10 ${
                              errors.telefono ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {errors.telefono && (
                          <p className="text-sm text-red-500">{errors.telefono}</p>
                        )}
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder={
                          isLogin ? "Tu contraseña" : "Mínimo 6 caracteres"
                        }
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className={`pl-10 ${
                          errors.password ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="tipoUsuario">Tipo de Usuario</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant={
                              formData.tipoUsuario === "individual"
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              handleInputChange("tipoUsuario", "individual")
                            }
                            className="flex items-center gap-2"
                          >
                            <User className="h-4 w-4" />
                            Individual
                          </Button>
                          <Button
                            type="button"
                            variant={
                              formData.tipoUsuario === "empresarial"
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              handleInputChange("tipoUsuario", "empresarial")
                            }
                            className="flex items-center gap-2"
                          >
                            <Building className="h-4 w-4" />
                            Empresarial
                          </Button>
                        </div>
                      </div>

                      {formData.tipoUsuario === "empresarial" && (
                        <div className="space-y-2">
                          <Label htmlFor="empresa">Nombre de la Empresa</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="empresa"
                              type="text"
                              placeholder="Nombre de tu empresa"
                              value={formData.empresa}
                              onChange={(e) =>
                                handleInputChange("empresa", e.target.value)
                              }
                              className={`pl-10 ${
                                errors.empresa ? "border-red-500" : ""
                              }`}
                            />
                          </div>
                          {errors.empresa && (
                            <p className="text-sm text-red-500">
                              {errors.empresa}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirmar Contraseña
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Repite tu contraseña"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              handleInputChange(
                                "confirmPassword",
                                e.target.value
                              )
                            }
                            className={`pl-10 ${
                              errors.confirmPassword ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-sm text-red-500">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading || isGoogleLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {isLogin ? "Iniciando sesión..." : "Creando cuenta..."}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                      </div>
                    )}
                  </Button>

                  {/* Separador */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">o</span>
                    </div>
                  </div>

                  {/* Botón de Google SSO */}
                  <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading || isGoogleLoading}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400"
                  >
                    {isGoogleLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        Iniciando con Google...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <GoogleIcon />
                        {isLogin ? "Continuar con Google" : "Registrarse con Google"}
                      </div>
                    )}
                  </Button>

                  {/* Modal de selección de perfil */}
                  {showProfileSelection && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                          Selecciona tu tipo de perfil
                        </h3>
                        <p className="text-sm text-gray-600 mb-6 text-center">
                          Elige el tipo de perfil que mejor se adapte a tus necesidades
                        </p>
                        
                        <div className="space-y-3">
                          {/* Perfil Individual */}
                          <button
                            onClick={() => handleProfileSelection("individual")}
                            className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Individual</h4>
                                <p className="text-sm text-gray-600">Para personas físicas</p>
                              </div>
                            </div>
                          </button>

                          {/* Perfil Empresarial */}
                          <button
                            onClick={() => handleProfileSelection("empresarial", "Mi Empresa")}
                            className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Building className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Empresarial</h4>
                                <p className="text-sm text-gray-600">Para empresas y organizaciones</p>
                              </div>
                            </div>
                          </button>

                          {/* Perfil Administrativo */}
                          <button
                            onClick={() => handleProfileSelection("individual")}
                            className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Shield className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Administrativo</h4>
                                <p className="text-sm text-gray-600">Para personal de la notaría</p>
                              </div>
                            </div>
                          </button>
                        </div>

                        <button
                          onClick={() => setShowProfileSelection(false)}
                          className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </form>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
                    <button
                      type="button"
                      onClick={switchMode}
                      className="ml-1 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      {isLogin ? "Regístrate aquí" : "Inicia sesión aquí"}
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
