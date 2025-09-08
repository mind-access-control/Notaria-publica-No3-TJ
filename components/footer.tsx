import Link from "next/link";
import {
  Shield,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <div className="text-lg font-bold text-foreground">
                Notaría Pública No. 3
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Servicios notariales profesionales en Tijuana con más de 20 años
              de experiencia. Atención personalizada y asesoría sin costo.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-8 w-8 text-primary hover:text-primary-foreground cursor-pointer transition-all duration-200 hover:scale-110 hover:bg-primary p-2 rounded-lg border border-primary/20" />
              <Instagram className="h-8 w-8 text-primary hover:text-primary-foreground cursor-pointer transition-all duration-200 hover:scale-110 hover:bg-primary p-2 rounded-lg border border-primary/20" />
              <Linkedin className="h-8 w-8 text-primary hover:text-primary-foreground cursor-pointer transition-all duration-200 hover:scale-110 hover:bg-primary p-2 rounded-lg border border-primary/20" />
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Servicios</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/servicios"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer hover:bg-primary/10 px-2 py-1 rounded"
                >
                  Compraventa
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer hover:bg-primary/10 px-2 py-1 rounded"
                >
                  Testamentos
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer hover:bg-primary/10 px-2 py-1 rounded"
                >
                  Poderes
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer hover:bg-primary/10 px-2 py-1 rounded"
                >
                  Sociedades
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer hover:bg-primary/10 px-2 py-1 rounded"
                >
                  Actos Familiares
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/simulador"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer hover:bg-primary/10 px-2 py-1 rounded"
                >
                  Simulador de Aranceles
                </Link>
              </li>
              <li>
                <Link
                  href="/citas"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer hover:bg-primary/10 px-2 py-1 rounded"
                >
                  Agendar Cita
                </Link>
              </li>
              <li>
                <Link
                  href="/portal-cliente"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer hover:bg-primary/10 px-2 py-1 rounded"
                >
                  Portal del Cliente
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer hover:bg-primary/10 px-2 py-1 rounded"
                >
                  Blog Educativo
                </Link>
              </li>
              <li>
                <Link
                  href="/formatos"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer hover:bg-primary/10 px-2 py-1 rounded"
                >
                  Formatos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer hover:bg-primary/10 px-2 py-1 rounded">
                  Av. Revolución 1234, Zona Centro
                  <br />
                  Tijuana, B.C. 22000
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a
                  href="tel:+526641234567"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer hover:bg-primary/10 px-2 py-1 rounded"
                >
                  (664) 123-4567
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a
                  href="mailto:info@notaria3tijuana.com"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer hover:bg-primary/10 px-2 py-1 rounded"
                >
                  info@notaria3tijuana.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-primary mt-0.5" />
                <div className="text-muted-foreground">
                  <div>Lun - Vie: 9:00 AM - 6:00 PM</div>
                  <div>Sáb: 9:00 AM - 2:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 Notaría Pública No. 3 Tijuana. Todos los derechos
              reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/aviso-privacidad"
                className="text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer hover:bg-primary/10 px-3 py-1 rounded"
              >
                Aviso de Privacidad
              </Link>
              <Link
                href="/terminos-condiciones"
                className="text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer hover:bg-primary/10 px-3 py-1 rounded"
              >
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
