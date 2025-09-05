"use client";

import React from "react";

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
import {
  Shield,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Calendar,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form or show success message
      alert(
        "Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto."
      );
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
              Estamos Aquí para Ayudarte
            </Badge>

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground text-balance">
              <span className="text-primary">Contacto</span>
            </h1>

            <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-3xl mx-auto">
              Ponte en contacto con nosotros para recibir asesoría
              personalizada. Estamos disponibles para resolver todas tus dudas
              sobre servicios notariales.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="text-center border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Horarios de Atención</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                  <strong>Lunes - Viernes:</strong> 9:00 AM - 6:00 PM
                </p>
                <p className="text-muted-foreground">
                  <strong>Sábados:</strong> 9:00 AM - 2:00 PM
                </p>
                <p className="text-muted-foreground">
                  <strong>Domingos:</strong> Cerrado
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Otras formas de contactarnos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/citas">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar Cita en Línea
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent cursor-pointer"
                  onClick={() =>
                    window.open("https://wa.me/526641234568", "_blank")
                  }
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp Directo
                </Button>

                <Button
                  variant="outline"
                  className="w-full bg-transparent cursor-pointer"
                  onClick={() => window.open("tel:+526641234567", "_self")}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Llamar Ahora
                </Button>

                <Button
                  variant="outline"
                  className="w-full bg-transparent cursor-pointer"
                  onClick={() =>
                    window.open("mailto:info@notaria3tijuana.com", "_self")
                  }
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar Email
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Envíanos un Mensaje
                </CardTitle>
                <CardDescription>
                  Completa el formulario y nos pondremos en contacto contigo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo *</Label>
                      <Input
                        id="name"
                        placeholder="Tu nombre completo"
                        value={formData.name}
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
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        placeholder="(664) 123-4567"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Servicio de Interés</Label>
                      <Select
                        value={formData.service}
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
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe tu consulta o el servicio que necesitas..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map and Additional Info */}
            <div className="space-y-8">
              {/* Map */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Nuestra Ubicación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Mapa */}
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3365.123456789!2d-117.030000!3d32.514000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d9480a474226c9%3A0x1234567890abcdef!2sAv.%20Revoluci%C3%B3n%201234%2C%20Zona%20Centro%2C%2022000%20Tijuana%2C%20B.C.%2C%20M%C3%A9xico!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Ubicación de Notaría Pública No. 3 Tijuana"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
