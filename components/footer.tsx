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
    <footer className="bg-gradient-to-r from-slate-800 via-blue-900 to-slate-900 border-t border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-white" />
              <div className="text-lg font-bold text-white">
                Notaría Pública No. 3
              </div>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Servicios notariales profesionales en Tijuana con más de 20 años
              de experiencia. Selecciona tu trámite y te guiamos paso a paso.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-8 w-8 text-white hover:text-blue-200 cursor-pointer transition-all duration-200 hover:scale-110 hover:bg-white/20 p-2 rounded-lg border border-white/30" />
              <Instagram className="h-8 w-8 text-white hover:text-blue-200 cursor-pointer transition-all duration-200 hover:scale-110 hover:bg-white/20 p-2 rounded-lg border border-white/30" />
              <Linkedin className="h-8 w-8 text-white hover:text-blue-200 cursor-pointer transition-all duration-200 hover:scale-110 hover:bg-white/20 p-2 rounded-lg border border-white/30" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/citas"
                  className="text-blue-100 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/10 px-2 py-1 rounded"
                >
                  Agendar Cita
                </Link>
              </li>
              <li>
                <Link
                  href="/continuar-tramite"
                  className="text-blue-100 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/10 px-2 py-1 rounded"
                >
                  Continuar Trámite
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-blue-100 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/10 px-2 py-1 rounded"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="/formatos"
                  className="text-blue-100 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/10 px-2 py-1 rounded"
                >
                  Formatos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contacto</h3>
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
                  className="text-blue-100 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/10 px-2 py-1 rounded"
                >
                  (664) 123-4567
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a
                  href="mailto:info@notaria3tijuana.com"
                  className="text-blue-100 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/10 px-2 py-1 rounded"
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

        <div className="border-t border-slate-600 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-blue-100 text-sm">
              © 2024 Notaría Pública No. 3 Tijuana. Todos los derechos
              reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/aviso-privacidad"
                className="text-blue-100 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/10 px-3 py-1 rounded"
              >
                Aviso de Privacidad
              </Link>
              <Link
                href="/terminos-condiciones"
                className="text-blue-100 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/10 px-3 py-1 rounded"
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
