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
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo y nombre */}
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-400" />
            <div className="text-base font-semibold text-white">
              Notaría Pública No. 3
            </div>
          </div>

          {/* Enlaces principales */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <Link
              href="/citas"
              className="text-slate-300 hover:text-blue-400 transition-colors font-medium"
            >
              Agendar Cita
            </Link>
            <Link
              href="/continuar-tramite"
              className="text-slate-300 hover:text-blue-400 transition-colors font-medium"
            >
              Continuar Trámite
            </Link>
            <Link
              href="/contacto"
              className="text-slate-300 hover:text-blue-400 transition-colors font-medium"
            >
              Contacto
            </Link>
            <Link
              href="/formatos"
              className="text-slate-300 hover:text-blue-400 transition-colors font-medium"
            >
              Formatos
            </Link>
          </div>

          {/* Redes sociales */}
          <div className="flex space-x-3">
            <Facebook className="h-5 w-5 text-slate-300 hover:text-blue-400 cursor-pointer transition-colors" />
            <Instagram className="h-5 w-5 text-slate-300 hover:text-blue-400 cursor-pointer transition-colors" />
            <Linkedin className="h-5 w-5 text-slate-300 hover:text-blue-400 cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Información de contacto compacta */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>(664) 123-4567</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>info@notaria3tijuana.com</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Link
                href="/aviso-privacidad"
                className="hover:text-blue-400 transition-colors"
              >
                Aviso de Privacidad
              </Link>
              <Link
                href="/terminos-condiciones"
                className="hover:text-blue-400 transition-colors"
              >
                Términos y Condiciones
              </Link>
            </div>
          </div>
          <div className="text-center mt-2 text-xs text-slate-500">
            © 2024 Notaría Pública No. 3 Tijuana. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
