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
      <DialogContent className="max-w-md bg-blue-50 border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-slate-800">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600">
            {isLogin
              ? "Accede a tu portal privado para gestionar tus trámites"
              : "Crea tu cuenta para acceder a tu portal personal"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={isLogin ? "login" : "register"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-blue-100">
            <TabsTrigger 
              value="login" 
              onClick={() => setIsLogin(true)}
              className="data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm"
            >
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              onClick={() => setIsLogin(false)}
              className="data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm"
            >
              Registrarse
            </TabsTrigger>
          </TabsList>

          <TabsContent value={isLogin ? "login" : "register"} className="mt-6">
            <Card className="bg-blue-50 border-blue-200">
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
                            placeholder="tu@email.com o +52 664 123 4567"
                            value={formData.loginField}
                            onChange={(e) =>
                              handleInputChange("loginField", e.target.value)
                            }
                            className={`pl-10 bg-white border-slate-300 ${
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
                        placeholder="Tu contraseña"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className={`pl-10 pr-10 bg-white border-slate-300 ${
                          errors.password ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
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
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={isLoading}
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

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-blue-50 px-2 text-slate-500">O CONTINÚA CON</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-slate-100 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Credenciales de prueba:</h4>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div><strong>Cliente:</strong> juan.perez@email.com / cliente123</div>
                    <div><strong>Licenciado:</strong> maria.rodriguez@notaria3tijuana.com / notario123</div>
                    <div><strong>Admin:</strong> admin@notaria3tijuana.com / admin123</div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-slate-600">
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
