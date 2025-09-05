"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Shield,
  ArrowLeft,
  CalendarIcon,
  Clock,
  User,
  Phone,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
];

export default function CitasPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentData, setAppointmentData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    notes: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setAppointmentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate appointment booking
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(4); // Success step
    }, 2000);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    const dayOfWeek = date.getDay();
    // Disable Sundays (0) and past dates
    return dayOfWeek === 0 || date < today;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-background to-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <Link
              href="/"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Link>

            <Badge variant="secondary" className="text-primary bg-primary/10">
              Agenda tu Cita en Línea
            </Badge>

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Agendar <span className="text-primary">Cita</span>
            </h1>

            <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-3xl mx-auto">
              Reserva tu cita de manera rápida y sencilla. Selecciona la fecha y
              hora que mejor te convenga para recibir atención personalizada.
            </p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: "Fecha y Hora", icon: CalendarIcon },
              { step: 2, title: "Información Personal", icon: User },
              { step: 3, title: "Confirmación", icon: CheckCircle },
            ].map(({ step, title, icon: Icon }) => (
              <div key={step} className="flex items-center space-x-2">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    currentStep >= step
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Booking */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {currentStep === 1 && (
              <Card className="border-border">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Selecciona Fecha y Hora
                  </CardTitle>
                  <CardDescription>
                    Elige el día y horario que mejor te convenga
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Calendar */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">
                        Selecciona una Fecha
                      </h3>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={isDateDisabled}
                        className="rounded-md border border-border"
                      />
                      <p className="text-xs text-muted-foreground">
                        * No atendemos los domingos
                      </p>
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">
                        Horarios Disponibles
                      </h3>
                      {selectedDate ? (
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setSelectedTime(time)}
                              className={
                                selectedTime === time
                                  ? "bg-primary hover:bg-primary/90"
                                  : ""
                              }
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>
                            Selecciona una fecha para ver horarios disponibles
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button
                      onClick={handleNextStep}
                      disabled={!selectedDate || !selectedTime}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Continuar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="border-border">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Información Personal
                  </CardTitle>
                  <CardDescription>
                    Completa tus datos para confirmar la cita
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo *</Label>
                      <Input
                        id="name"
                        placeholder="Tu nombre completo"
                        value={appointmentData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={appointmentData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input
                        id="phone"
                        placeholder="(664) 123-4567"
                        value={appointmentData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Servicio Requerido *</Label>
                      <Select
                        value={appointmentData.service}
                        onValueChange={(value) =>
                          handleInputChange("service", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compraventa">
                            Compraventa de Inmuebles
                          </SelectItem>
                          <SelectItem value="testamento">
                            Testamentos
                          </SelectItem>
                          <SelectItem value="poder">
                            Poderes Notariales
                          </SelectItem>
                          <SelectItem value="sociedad">
                            Constitución de Sociedades
                          </SelectItem>
                          <SelectItem value="divorcio">Divorcio</SelectItem>
                          <SelectItem value="consulta">
                            Consulta General
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea
                      id="notes"
                      placeholder="Describe brevemente el motivo de tu cita o cualquier información relevante..."
                      rows={3}
                      value={appointmentData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>
                      Regresar
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      disabled={
                        !appointmentData.name ||
                        !appointmentData.email ||
                        !appointmentData.phone ||
                        !appointmentData.service
                      }
                      className="bg-primary hover:bg-primary/90"
                    >
                      Continuar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="border-border">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Confirmar Cita
                  </CardTitle>
                  <CardDescription>
                    Revisa los datos de tu cita antes de confirmar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">
                        Fecha y Hora
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-primary" />
                          <span>
                            {selectedDate?.toLocaleDateString("es-MX", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{selectedTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">
                        Información Personal
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Nombre:</strong> {appointmentData.name}
                        </div>
                        <div>
                          <strong>Email:</strong> {appointmentData.email}
                        </div>
                        <div>
                          <strong>Teléfono:</strong> {appointmentData.phone}
                        </div>
                        <div>
                          <strong>Servicio:</strong> {appointmentData.service}
                        </div>
                      </div>
                    </div>
                  </div>

                  {appointmentData.notes && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">Notas</h3>
                      <p className="text-sm text-muted-foreground bg-card p-3 rounded-lg">
                        {appointmentData.notes}
                      </p>
                    </div>
                  )}

                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-sm text-foreground">
                      <strong>Importante:</strong> Recibirás un correo de
                      confirmación con los detalles de tu cita. Si necesitas
                      cancelar o reprogramar, contáctanos al menos 24 horas
                      antes.
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>
                      Regresar
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Confirmando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirmar Cita
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card className="border-border">
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    ¡Cita Confirmada!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Tu cita ha sido agendada exitosamente. Recibirás un correo
                    de confirmación en breve.
                  </p>

                  <div className="bg-card p-6 rounded-lg mb-6 text-left max-w-md mx-auto">
                    <h3 className="font-semibold text-foreground mb-3">
                      Detalles de tu Cita
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <span>
                          {selectedDate?.toLocaleDateString("es-MX", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{selectedTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span>{appointmentData.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                      <Button variant="outline">Volver al Inicio</Button>
                    </Link>
                    <Link href="/contacto">
                      <Button className="bg-primary hover:bg-primary/90">
                        <Phone className="mr-2 h-4 w-4" />
                        Contactar Notaría
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
