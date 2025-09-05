import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  Calendar,
  FileText,
  Shield,
  Clock,
  CreditCard,
  Users,
  Phone,
  Mail,
  BookOpen,
  Play,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section
        id="inicio"
        className="py-12 sm:py-16 lg:py-32 bg-gradient-to-br from-background to-card"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="text-primary-foreground bg-primary text-xs sm:text-sm"
                >
                  Servicios Notariales Profesionales
                </Badge>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-foreground text-balance leading-tight">
                  Tu Notaría de Confianza en{" "}
                  <span className="text-primary">Tijuana</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-pretty leading-relaxed">
                  Más de 20 años brindando servicios notariales con la más alta
                  calidad, rapidez y profesionalismo. Tu tranquilidad es nuestra
                  prioridad.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl">
                <Link href="/simulador" className="cursor-pointer">
                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                  >
                    <Calculator className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Simular Aranceles
                  </Button>
                </Link>
                <Link href="/citas" className="cursor-pointer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent cursor-pointer"
                  >
                    <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Agendar Cita
                  </Button>
                </Link>
                <Link href="/formatos" className="cursor-pointer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent cursor-pointer"
                  >
                    <FileText className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Descargar Formatos
                  </Button>
                </Link>
                <Link href="/portal-cliente" className="cursor-pointer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent cursor-pointer"
                  >
                    <Shield className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Consulta Expediente
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative order-first lg:order-last">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center p-4">
                <img
                  src="/professional-notary-office-building-in-tijuana-mex.jpg"
                  alt="Notaría Pública No. 3 Tijuana"
                  className="w-full h-full object-cover rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-12 sm:py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              ¿Por qué elegir nuestra notaría?
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Nos diferenciamos por nuestro compromiso con la excelencia
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="text-center border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-base sm:text-lg">
                  Atención Personalizada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Cada cliente recibe atención dedicada y asesoría especializada
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-base sm:text-lg">
                  Agenda de Citas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Reserva tu cita en línea de manera rápida y sencilla
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-base sm:text-lg">
                  Descarga de Formatos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Obtén los documentos necesarios para tu trámite
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-base sm:text-lg">
                  Consulta Expediente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Consulta el estatus de tu expediente en tiempo real
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-base sm:text-lg">
                  Tiempos Rápidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Procesos eficientes que respetan tu tiempo y urgencias
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-base sm:text-lg">
                  Asesoría Sin Costo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Consulta inicial gratuita para orientarte en tu trámite
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-base sm:text-lg">
                  Todas las Tarjetas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Aceptamos todos los métodos de pago para tu comodidad
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Access Tools */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Herramientas y Servicios
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Accede rápidamente a nuestros servicios digitales
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Card className="border-border hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="text-center pb-4">
                <Calculator className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg sm:text-xl">
                  Simulador de Aranceles
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Calcula el costo estimado de tu trámite notarial
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/simulador" className="cursor-pointer">
                  <Button className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
                    Calcular Costos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="text-center pb-4">
                <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg sm:text-xl">
                  Agenda de Citas
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Reserva tu cita en línea de manera rápida y sencilla
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/citas" className="cursor-pointer">
                  <Button className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
                    Agendar Ahora
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="text-center pb-4">
                <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg sm:text-xl">
                  Descarga de Formatos
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Obtén los documentos necesarios para tu trámite
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/formatos" className="cursor-pointer">
                  <Button className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
                    Ver Formatos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="text-center pb-4">
                <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg sm:text-xl">
                  Consulta Expediente
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Consulta el estatus de tu expediente en tiempo real
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/portal-cliente" className="cursor-pointer">
                  <Button className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
                    Consultar Expediente
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section id="servicios" className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Nuestros Servicios Principales
            </h2>
            <p className="text-muted-foreground text-lg">
              Servicios notariales completos para todas tus necesidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Compraventa de Inmuebles",
                desc: "Escrituración segura de propiedades",
              },
              { title: "Testamentos", desc: "Protege el futuro de tu familia" },
              {
                title: "Poderes Notariales",
                desc: "Representación legal confiable",
              },
              {
                title: "Constitución de Sociedades",
                desc: "Formaliza tu empresa",
              },
              { title: "Divorcios", desc: "Trámites matrimoniales" },
              {
                title: "Reconocimiento de Firmas",
                desc: "Validación de documentos",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="border-border hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/servicios" className="cursor-pointer">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent cursor-pointer"
              >
                Ver Todos los Servicios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Educational Content Preview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Centro de Conocimiento
            </h2>
            <p className="text-muted-foreground text-lg">
              Mantente informado con nuestro contenido educativo
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="text-center pb-4">
                <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg sm:text-xl">
                  Blog Educativo
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Artículos informativos y guías prácticas sobre servicios
                  notariales
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/blog" className="cursor-pointer">
                  <Button className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
                    Leer Artículos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="text-center pb-4">
                <Play className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg sm:text-xl">
                  Videos del Notario
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Explicaciones breves sobre temas legales importantes
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/blog?tab=videos" className="cursor-pointer">
                  <Button className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
                    Ver Videos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bank Partnerships */}
      <section className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Alianzas Estratégicas
            </h3>
            <p className="text-muted-foreground">
              Trabajamos con las principales instituciones financieras
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {[
              "BBVA",
              "Santander",
              "Banamex",
              "Banorte",
              "HSBC",
              "Scotiabank",
            ].map((bank) => (
              <div
                key={bank}
                className="text-lg font-semibold text-muted-foreground"
              >
                {bank}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Necesitas Asesoría Legal?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contáctanos hoy mismo y recibe atención personalizada
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto" className="cursor-pointer">
              <Button
                size="lg"
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90 cursor-pointer"
              >
                <Phone className="mr-2 h-5 w-5" />
                Llamar Ahora
              </Button>
            </Link>
            <Link href="/contacto" className="cursor-pointer">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent cursor-pointer"
              >
                <Mail className="mr-2 h-5 w-5" />
                Enviar Mensaje
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
