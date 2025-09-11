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
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
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
