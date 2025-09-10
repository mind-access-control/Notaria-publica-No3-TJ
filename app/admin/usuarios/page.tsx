"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  User,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Settings,
  Eye,
  Key,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";

// Tipos de datos
interface Usuario {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  telefono: string;
  rol: "admin" | "notario" | "abogado" | "asistente" | "contador";
  permisos: string[];
  activo: boolean;
  fechaCreacion: string;
  ultimoAcceso: string;
  expedientesAsignados: number;
  tareasPendientes: number;
  especialidades: string[];
  foto?: string;
  horarioTrabajo: {
    inicio: string;
    fin: string;
    dias: string[];
  };
}

interface Rol {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: string[];
  nivel: number;
  activo: boolean;
}

// Datos simulados
const usuariosIniciales: Usuario[] = [
  {
    id: "user_001",
    nombre: "María",
    apellidoPaterno: "López",
    apellidoMaterno: "García",
    email: "maria.lopez@notaria.com",
    telefono: "6641234567",
    rol: "notario",
    permisos: [
      "ver_expedientes",
      "editar_expedientes",
      "aprobar_documentos",
      "gestionar_citas",
    ],
    activo: true,
    fechaCreacion: "2024-01-01",
    ultimoAcceso: "2024-01-20 14:30",
    expedientesAsignados: 8,
    tareasPendientes: 3,
    especialidades: ["Testamentos", "Compraventas", "Poderes"],
    horarioTrabajo: {
      inicio: "09:00",
      fin: "18:00",
      dias: ["lunes", "martes", "miércoles", "jueves", "viernes"],
    },
  },
  {
    id: "user_002",
    nombre: "Carlos",
    apellidoPaterno: "Herrera",
    apellidoMaterno: "Martínez",
    email: "carlos.herrera@notaria.com",
    telefono: "6642345678",
    rol: "notario",
    permisos: [
      "ver_expedientes",
      "editar_expedientes",
      "aprobar_documentos",
      "gestionar_citas",
    ],
    activo: true,
    fechaCreacion: "2024-01-01",
    ultimoAcceso: "2024-01-20 16:45",
    expedientesAsignados: 5,
    tareasPendientes: 2,
    especialidades: ["Sucesiones", "Fideicomisos", "Sociedades"],
    horarioTrabajo: {
      inicio: "08:00",
      fin: "17:00",
      dias: ["lunes", "martes", "miércoles", "jueves", "viernes"],
    },
  },
  {
    id: "user_003",
    nombre: "Ana",
    apellidoPaterno: "García",
    apellidoMaterno: "Ruiz",
    email: "ana.garcia@notaria.com",
    telefono: "6643456789",
    rol: "abogado",
    permisos: ["ver_expedientes", "revisar_documentos", "asignar_tareas"],
    activo: true,
    fechaCreacion: "2024-01-05",
    ultimoAcceso: "2024-01-20 12:15",
    expedientesAsignados: 12,
    tareasPendientes: 5,
    especialidades: ["Derecho Civil", "Derecho Mercantil"],
    horarioTrabajo: {
      inicio: "09:30",
      fin: "18:30",
      dias: ["lunes", "martes", "miércoles", "jueves", "viernes"],
    },
  },
  {
    id: "user_004",
    nombre: "Roberto",
    apellidoPaterno: "Silva",
    apellidoMaterno: "Morales",
    email: "roberto.silva@notaria.com",
    telefono: "6644567890",
    rol: "asistente",
    permisos: ["ver_expedientes", "subir_documentos", "gestionar_citas"],
    activo: true,
    fechaCreacion: "2024-01-10",
    ultimoAcceso: "2024-01-20 10:20",
    expedientesAsignados: 15,
    tareasPendientes: 8,
    especialidades: ["Atención al Cliente", "Gestión Documental"],
    horarioTrabajo: {
      inicio: "08:30",
      fin: "17:30",
      dias: ["lunes", "martes", "miércoles", "jueves", "viernes"],
    },
  },
];

const rolesDisponibles: Rol[] = [
  {
    id: "admin",
    nombre: "Administrador",
    descripcion: "Acceso completo al sistema",
    permisos: ["*"],
    nivel: 5,
    activo: true,
  },
  {
    id: "notario",
    nombre: "Notario",
    descripcion: "Notario público con permisos completos de expedientes",
    permisos: [
      "ver_expedientes",
      "editar_expedientes",
      "aprobar_documentos",
      "gestionar_citas",
      "generar_escrituras",
    ],
    nivel: 4,
    activo: true,
  },
  {
    id: "abogado",
    nombre: "Abogado",
    descripcion: "Abogado con permisos de revisión y asesoría",
    permisos: [
      "ver_expedientes",
      "revisar_documentos",
      "asignar_tareas",
      "gestionar_citas",
    ],
    nivel: 3,
    activo: true,
  },
  {
    id: "asistente",
    nombre: "Asistente",
    descripcion: "Asistente con permisos básicos",
    permisos: ["ver_expedientes", "subir_documentos", "gestionar_citas"],
    nivel: 2,
    activo: true,
  },
  {
    id: "contador",
    nombre: "Contador",
    descripcion: "Contador con permisos de gestión financiera",
    permisos: [
      "ver_expedientes",
      "gestionar_cobros",
      "generar_reportes_financieros",
    ],
    nivel: 3,
    activo: true,
  },
];

const permisosDisponibles = [
  "ver_expedientes",
  "editar_expedientes",
  "crear_expedientes",
  "eliminar_expedientes",
  "aprobar_documentos",
  "revisar_documentos",
  "subir_documentos",
  "gestionar_citas",
  "asignar_tareas",
  "generar_escrituras",
  "gestionar_cobros",
  "generar_reportes",
  "gestionar_usuarios",
  "configurar_tramites",
  "ver_analytics",
];

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciales);
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<Usuario | null>(null);
  const [mostrarDialog, setMostrarDialog] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [filtroRol, setFiltroRol] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState("");
  const [mostrarAgregarEspecialidad, setMostrarAgregarEspecialidad] =
    useState(false);

  const handleCrearUsuario = () => {
    const nuevoUsuario: Usuario = {
      id: `user_${Date.now()}`,
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      email: "",
      telefono: "",
      rol: "asistente",
      permisos: [],
      activo: true,
      fechaCreacion: new Date().toISOString().split("T")[0],
      ultimoAcceso: "Nunca",
      expedientesAsignados: 0,
      tareasPendientes: 0,
      especialidades: [],
      horarioTrabajo: {
        inicio: "09:00",
        fin: "18:00",
        dias: ["lunes", "martes", "miércoles", "jueves", "viernes"],
      },
    };
    setUsuarioSeleccionado(nuevoUsuario);
    setModoEdicion(false);
    setMostrarDialog(true);
  };

  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setModoEdicion(true);
    setMostrarDialog(true);
  };

  const handleGuardarUsuario = () => {
    if (usuarioSeleccionado) {
      if (modoEdicion) {
        setUsuarios((prev) =>
          prev.map((u) =>
            u.id === usuarioSeleccionado.id ? usuarioSeleccionado : u
          )
        );
      } else {
        setUsuarios((prev) => [...prev, usuarioSeleccionado]);
      }
      setMostrarDialog(false);
      setUsuarioSeleccionado(null);
      setModoEdicion(false);
    }
  };

  const handleEliminarUsuario = (id: string) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  const handleToggleActivo = (id: string) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u))
    );
  };

  const handleCambiarRol = (id: string, nuevoRol: string) => {
    const rol = rolesDisponibles.find((r) => r.id === nuevoRol);
    if (rol) {
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, rol: nuevoRol as any, permisos: rol.permisos }
            : u
        )
      );
    }
  };

  const handleAgregarEspecialidad = () => {
    if (nuevaEspecialidad.trim() && usuarioSeleccionado) {
      setUsuarioSeleccionado((prev) =>
        prev
          ? {
              ...prev,
              especialidades: [
                ...prev.especialidades,
                nuevaEspecialidad.trim(),
              ],
            }
          : null
      );
      setNuevaEspecialidad("");
      setMostrarAgregarEspecialidad(false);
    }
  };

  const handleEliminarEspecialidad = (especialidad: string) => {
    if (usuarioSeleccionado) {
      setUsuarioSeleccionado((prev) =>
        prev
          ? {
              ...prev,
              especialidades: prev.especialidades.filter(
                (e) => e !== especialidad
              ),
            }
          : null
      );
    }
  };

  const handleCambiarFoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && usuarioSeleccionado) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUsuarioSeleccionado((prev) =>
          prev ? { ...prev, foto: result } : null
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const cumpleRol = filtroRol === "todos" || usuario.rol === filtroRol;
    const cumpleBusqueda =
      busqueda === "" ||
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.apellidoPaterno.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase());

    return cumpleRol && cumpleBusqueda;
  });

  const getRolColor = (rol: string) => {
    switch (rol) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "notario":
        return "bg-blue-100 text-blue-800";
      case "abogado":
        return "bg-green-100 text-green-800";
      case "asistente":
        return "bg-yellow-100 text-yellow-800";
      case "contador":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRolIcon = (rol: string) => {
    switch (rol) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "notario":
        return <User className="h-4 w-4" />;
      case "abogado":
        return <UserCheck className="h-4 w-4" />;
      case "asistente":
        return <Users className="h-4 w-4" />;
      case "contador":
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Usuarios
              </h1>
              <p className="text-gray-600">
                Administra usuarios, roles y permisos del sistema
              </p>
            </div>
            <Button onClick={handleCrearUsuario}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={filtroRol} onValueChange={setFiltroRol}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los roles</SelectItem>
                  {rolesDisponibles.map((rol) => (
                    <SelectItem key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de usuarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usuariosFiltrados.map((usuario) => (
            <Card
              key={usuario.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {usuario.foto ? (
                        <img
                          src={usuario.foto}
                          alt={`${usuario.nombre} ${usuario.apellidoPaterno}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getRolIcon(usuario.rol)
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {usuario.nombre} {usuario.apellidoPaterno}
                      </CardTitle>
                      <CardDescription>{usuario.email}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getRolColor(usuario.rol)}>
                    {usuario.rol}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Teléfono:</span>
                    <p className="font-medium">{usuario.telefono}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Estado:</span>
                    <div className="flex items-center space-x-2">
                      {usuario.activo ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={
                          usuario.activo ? "text-green-600" : "text-red-600"
                        }
                      >
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Expedientes:</span>
                    <p className="font-medium">
                      {usuario.expedientesAsignados}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tareas:</span>
                    <p className="font-medium">{usuario.tareasPendientes}</p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 text-sm">Especialidades:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {usuario.especialidades.map((especialidad, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {especialidad}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 text-sm">Último acceso:</span>
                  <p className="text-sm">{usuario.ultimoAcceso}</p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditarUsuario(usuario)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActivo(usuario.id)}
                    className={
                      usuario.activo ? "text-red-600" : "text-green-600"
                    }
                  >
                    {usuario.activo ? (
                      <UserX className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEliminarUsuario(usuario.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog para crear/editar usuario */}
        <Dialog open={mostrarDialog} onOpenChange={setMostrarDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {modoEdicion ? "Editar Usuario" : "Crear Nuevo Usuario"}
              </DialogTitle>
              <DialogDescription>
                Configura la información personal, rol y permisos del usuario
              </DialogDescription>
            </DialogHeader>

            {usuarioSeleccionado && (
              <div className="space-y-6">
                {/* Información personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Información Personal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        value={usuarioSeleccionado.nombre}
                        onChange={(e) =>
                          setUsuarioSeleccionado((prev) =>
                            prev ? { ...prev, nombre: e.target.value } : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="apellidoPaterno">Apellido Paterno</Label>
                      <Input
                        id="apellidoPaterno"
                        value={usuarioSeleccionado.apellidoPaterno}
                        onChange={(e) =>
                          setUsuarioSeleccionado((prev) =>
                            prev
                              ? { ...prev, apellidoPaterno: e.target.value }
                              : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
                      <Input
                        id="apellidoMaterno"
                        value={usuarioSeleccionado.apellidoMaterno}
                        onChange={(e) =>
                          setUsuarioSeleccionado((prev) =>
                            prev
                              ? { ...prev, apellidoMaterno: e.target.value }
                              : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={usuarioSeleccionado.email}
                        onChange={(e) =>
                          setUsuarioSeleccionado((prev) =>
                            prev ? { ...prev, email: e.target.value } : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        value={usuarioSeleccionado.telefono}
                        onChange={(e) =>
                          setUsuarioSeleccionado((prev) =>
                            prev ? { ...prev, telefono: e.target.value } : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="rol">Rol</Label>
                      <Select
                        value={usuarioSeleccionado.rol}
                        onValueChange={(value) => {
                          const rol = rolesDisponibles.find(
                            (r) => r.id === value
                          );
                          setUsuarioSeleccionado((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  rol: value as any,
                                  permisos: rol ? rol.permisos : prev.permisos,
                                }
                              : null
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {rolesDisponibles.map((rol) => (
                            <SelectItem key={rol.id} value={rol.id}>
                              {rol.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Especialidades */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Especialidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {usuarioSeleccionado.especialidades.map(
                      (especialidad, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-red-50"
                          onClick={() =>
                            handleEliminarEspecialidad(especialidad)
                          }
                        >
                          {especialidad} ×
                        </Badge>
                      )
                    )}
                    {!mostrarAgregarEspecialidad ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setMostrarAgregarEspecialidad(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Nueva especialidad"
                          value={nuevaEspecialidad}
                          onChange={(e) => setNuevaEspecialidad(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAgregarEspecialidad();
                            }
                          }}
                          className="w-48"
                        />
                        <Button
                          size="sm"
                          onClick={handleAgregarEspecialidad}
                          disabled={!nuevaEspecialidad.trim()}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setMostrarAgregarEspecialidad(false);
                            setNuevaEspecialidad("");
                          }}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Foto de perfil */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Foto de Perfil</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {usuarioSeleccionado.foto ? (
                        <img
                          src={usuarioSeleccionado.foto}
                          alt="Foto de perfil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCambiarFoto}
                        className="hidden"
                        id="foto-input"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("foto-input")?.click()
                        }
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {usuarioSeleccionado.foto
                          ? "Cambiar foto"
                          : "Agregar foto"}
                      </Button>
                      {usuarioSeleccionado.foto && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setUsuarioSeleccionado((prev) =>
                              prev ? { ...prev, foto: undefined } : null
                            )
                          }
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar foto
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Horario de trabajo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Horario de Trabajo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="inicio">Hora de inicio</Label>
                      <Input
                        id="inicio"
                        type="time"
                        value={usuarioSeleccionado.horarioTrabajo.inicio}
                        onChange={(e) =>
                          setUsuarioSeleccionado((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  horarioTrabajo: {
                                    ...prev.horarioTrabajo,
                                    inicio: e.target.value,
                                  },
                                }
                              : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="fin">Hora de fin</Label>
                      <Input
                        id="fin"
                        type="time"
                        value={usuarioSeleccionado.horarioTrabajo.fin}
                        onChange={(e) =>
                          setUsuarioSeleccionado((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  horarioTrabajo: {
                                    ...prev.horarioTrabajo,
                                    fin: e.target.value,
                                  },
                                }
                              : null
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Estado */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={usuarioSeleccionado.activo}
                    onChange={(e) =>
                      setUsuarioSeleccionado((prev) =>
                        prev ? { ...prev, activo: e.target.checked } : null
                      )
                    }
                  />
                  <Label htmlFor="activo">Usuario activo</Label>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setMostrarDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGuardarUsuario}>
                <Settings className="h-4 w-4 mr-2" />
                Guardar Usuario
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
