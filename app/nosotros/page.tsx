"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeamMemberModal } from "@/components/team-member-modal";
import {
  Shield,
  Target,
  Heart,
  Users,
  Award,
  ArrowLeft,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const teamMembers = [
  {
    name: "Lic. María Elena Rodríguez Hernández",
    position: "Notario Titular",
    image: "/professional-mexican-female-notary-lawyer.jpg",
    bio: "Notario Público con más de 25 años de experiencia en el ejercicio del derecho notarial. Especialista en derecho inmobiliario y societario, ha participado en más de 10,000 actos notariales a lo largo de su carrera. Reconocida por su dedicación al servicio público y su compromiso con la excelencia profesional.",
    education: [
      "Licenciatura en Derecho - Universidad Autónoma de Baja California (UABC)",
      "Maestría en Derecho Notarial - Universidad Nacional Autónoma de México (UNAM)",
      "Diplomado en Derecho Inmobiliario - Colegio de Notarios de Baja California",
    ],
    experience:
      "Inició su carrera como abogada litigante en 1995, posteriormente se especializó en derecho notarial. Fue designada como Notario Público No. 3 en 1999. Ha sido presidenta del Colegio de Notarios de Baja California y miembro activo de diversas asociaciones profesionales.",
    specialties: [
      "Derecho Inmobiliario",
      "Derecho Societario",
      "Testamentos y Sucesiones",
      "Derecho Familiar",
    ],
    email: "mrodriguez@notaria3tijuana.com",
    phone: "(664) 123-4567 ext. 101",
    yearsExperience: 25,
  },
  {
    name: "Lic. Carlos Alberto Mendoza Silva",
    position: "Notario Adscrito",
    image: "/professional-mexican-male-notary-lawyer.jpg",
    bio: "Notario Adscrito con sólida formación en derecho civil y mercantil. Especialista en constitución de sociedades y reestructuraciones corporativas. Su enfoque se centra en brindar soluciones integrales a empresarios y particulares, combinando conocimiento técnico con atención personalizada.",
    education: [
      "Licenciatura en Derecho - Instituto Tecnológico Autónomo de México (ITAM)",
      "Especialidad en Derecho Corporativo - Universidad Iberoamericana",
      "Certificación en Derecho Notarial - Colegio Nacional del Notariado Mexicano",
    ],
    experience:
      "Con 15 años de experiencia en el ámbito notarial, ha colaborado en la estructuración de más de 500 sociedades mercantiles. Anteriormente trabajó en despachos corporativos especializados en fusiones y adquisiciones.",
    specialties: [
      "Derecho Corporativo",
      "Fusiones y Adquisiciones",
      "Poderes Notariales",
      "Contratos Mercantiles",
    ],
    email: "cmendoza@notaria3tijuana.com",
    phone: "(664) 123-4567 ext. 102",
    yearsExperience: 15,
  },
  {
    name: "Lic. Ana Patricia Flores Morales",
    position: "Abogada Especialista",
    image: "/professional-mexican-female-lawyer.jpg",
    bio: "Abogada especialista en derecho familiar y sucesorio. Experta en la elaboración de testamentos y tramitación de sucesiones. Su enfoque empático y profesional la ha convertido en la referencia para familias que buscan proteger su patrimonio y planificar su futuro.",
    education: [
      "Licenciatura en Derecho - Universidad de Tijuana (UT)",
      "Maestría en Derecho Familiar - Universidad Autónoma de Baja California",
      "Diplomado en Mediación Familiar - Centro de Mediación de Tijuana",
    ],
    experience:
      "12 años de experiencia en derecho familiar y sucesorio. Ha participado en más de 2,000 procesos de elaboración de testamentos y 800 tramitaciones sucesorias. Certificada como mediadora familiar.",
    specialties: [
      "Derecho Familiar",
      "Testamentos",
      "Sucesiones",
      "Mediación Familiar",
    ],
    email: "aflores@notaria3tijuana.com",
    phone: "(664) 123-4567 ext. 103",
    yearsExperience: 12,
  },
  {
    name: "Lic. Roberto Javier Castillo Pérez",
    position: "Abogado Asociado",
    image: "/professional-mexican-male-lawyer.jpg",
    bio: "Abogado joven y dinámico especializado en derecho inmobiliario y nuevas tecnologías aplicadas al derecho notarial. Responsable de la implementación de sistemas digitales en la notaría y especialista en trámites de compraventa de inmuebles.",
    education: [
      "Licenciatura en Derecho - Centro de Enseñanza Técnica y Superior (CETYS)",
      "Especialidad en Derecho Inmobiliario - Universidad Panamericana",
      "Certificación en LegalTech - Tecnológico de Monterrey",
    ],
    experience:
      "8 años de experiencia en derecho inmobiliario. Ha participado en más de 1,500 operaciones de compraventa. Pionero en la implementación de tecnologías digitales para agilizar procesos notariales.",
    specialties: [
      "Derecho Inmobiliario",
      "Tecnología Legal",
      "Compraventa",
      "Procesos Digitales",
    ],
    email: "rcastillo@notaria3tijuana.com",
    phone: "(664) 123-4567 ext. 104",
    yearsExperience: 8,
  },
];

export default function NosotrosPage() {
  const [selectedMember, setSelectedMember] = useState<
    (typeof teamMembers)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMemberClick = (member: (typeof teamMembers)[0]) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
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
              Conoce Nuestro Equipo
            </Badge>

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Acerca de <span className="text-primary">Nosotros</span>
            </h1>

            <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-3xl mx-auto">
              Somos un equipo de profesionales comprometidos con brindar
              servicios notariales de la más alta calidad, respaldados por más
              de 20 años de experiencia y un profundo conocimiento del derecho
              mexicano.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Misión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Brindar servicios notariales de excelencia con integridad,
                  profesionalismo y calidez humana, garantizando la seguridad
                  jurídica de nuestros clientes y contribuyendo al desarrollo de
                  nuestra comunidad.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Visión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Ser la notaría líder en Tijuana, reconocida por nuestra
                  innovación, eficiencia y compromiso social, estableciendo
                  nuevos estándares en la prestación de servicios notariales
                  modernos y accesibles.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2 text-left">
                  <li>
                    • <strong>Integridad:</strong> Actuamos con honestidad y
                    transparencia
                  </li>
                  <li>
                    • <strong>Excelencia:</strong> Buscamos la perfección en
                    cada servicio
                  </li>
                  <li>
                    • <strong>Compromiso:</strong> Dedicación total con nuestros
                    clientes
                  </li>
                  <li>
                    • <strong>Innovación:</strong> Adoptamos nuevas tecnologías
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Nuestro Equipo Profesional
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Conoce a los profesionales que conforman nuestro equipo, cada uno
              especializado en diferentes áreas del derecho notarial para
              brindarte el mejor servicio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="text-center border-border hover:shadow-lg transition-all hover:scale-105 cursor-pointer group"
                onClick={() => handleMemberClick(member)}
              >
                <CardHeader className="space-y-4">
                  <div className="relative mx-auto">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/40 transition-colors"
                    />
                    <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {member.name}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="text-primary bg-primary/10 mt-2"
                    >
                      {member.position}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>{member.yearsExperience} años de experiencia</span>
                    </div>
                    <p className="text-xs">Haz clic para ver más detalles</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Nuestra Experiencia
            </h2>
            <p className="text-muted-foreground text-lg">
              Más de dos décadas sirviendo a la comunidad de Tijuana
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">20+</div>
              <div className="text-muted-foreground">Años de Experiencia</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">15,000+</div>
              <div className="text-muted-foreground">Actos Notariales</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">98%</div>
              <div className="text-muted-foreground">
                Satisfacción del Cliente
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Atención Disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Quieres conocer más sobre nuestro equipo?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Agenda una cita y conoce personalmente a nuestros profesionales
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/citas">
              <Button
                size="lg"
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90 cursor-pointer"
              >
                <Phone className="mr-2 h-5 w-5" />
                Agendar Cita
              </Button>
            </Link>
            <Link href="/contacto">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent cursor-pointer"
              >
                <Mail className="mr-2 h-5 w-5" />
                Contactar Equipo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Team Member Modal */}
      <TeamMemberModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
