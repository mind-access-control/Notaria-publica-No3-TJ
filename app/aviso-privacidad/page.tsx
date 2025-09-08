import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Shield,
  Eye,
  Lock,
  Database,
  UserCheck,
  AlertTriangle,
  Mail,
  Phone,
} from "lucide-react";

export default function AvisoPrivacidad() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Aviso de Privacidad
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            En Notaría Pública No. 3 Tijuana, nos comprometemos a proteger tu
            información personal y respetar tu privacidad conforme a la
            legislación mexicana vigente.
          </p>
          <div className="mt-4 text-sm text-slate-500">
            Última actualización: {new Date().toLocaleDateString("es-MX")}
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Responsable del Tratamiento */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100">
              <CardTitle className="flex items-center gap-3 text-emerald-800">
                <UserCheck className="h-6 w-6" />
                Responsable del Tratamiento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 text-slate-700">
                <p>
                  <strong>Notaría Pública No. 3 Tijuana</strong>
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <strong>Domicilio:</strong>
                    </p>
                    <p>
                      Av. Revolución 1234, Zona Centro
                      <br />
                      Tijuana, B.C. 22000
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Contacto:</strong>
                    </p>
                    <p>
                      Tel: (664) 123-4567
                      <br />
                      Email: info@notaria3tijuana.com
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datos Personales */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="flex items-center gap-3 text-blue-800">
                <Database className="h-6 w-6" />
                Datos Personales que Recopilamos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">
                    Datos de Identificación:
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                    <li>Nombre completo</li>
                    <li>Fecha de nacimiento</li>
                    <li>CURP</li>
                    <li>RFC</li>
                    <li>Identificación oficial</li>
                    <li>Comprobante de domicilio</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">
                    Datos de Contacto:
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                    <li>Número telefónico</li>
                    <li>Correo electrónico</li>
                    <li>Dirección domiciliaria</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">
                    Datos Patrimoniales:
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                    <li>Información sobre bienes inmuebles</li>
                    <li>Documentos de propiedad</li>
                    <li>Información financiera relevante</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Finalidades */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="flex items-center gap-3 text-purple-800">
                <Eye className="h-6 w-6" />
                Finalidades del Tratamiento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 text-slate-700">
                <p>
                  Utilizamos tus datos personales para las siguientes
                  finalidades:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Prestar servicios notariales conforme a la ley</li>
                  <li>Elaborar documentos notariales y actos jurídicos</li>
                  <li>
                    Mantener comunicación contigo sobre nuestros servicios
                  </li>
                  <li>Cumplir con obligaciones legales y fiscales</li>
                  <li>Proporcionar asesoría jurídica especializada</li>
                  <li>Gestionar citas y servicios</li>
                  <li>Mejorar nuestros servicios y atención al cliente</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Transferencias */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
              <CardTitle className="flex items-center gap-3 text-orange-800">
                <Lock className="h-6 w-6" />
                Transferencias y Compartir Información
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 text-slate-700">
                <p>
                  Podemos transferir tus datos personales en los siguientes
                  casos:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    A autoridades competentes cuando sea requerido por ley
                  </li>
                  <li>A registros públicos para el registro de documentos</li>
                  <li>
                    A instituciones financieras cuando sea necesario para el
                    trámite
                  </li>
                  <li>A terceros autorizados por ti expresamente</li>
                </ul>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-orange-800 font-medium">
                    <strong>Importante:</strong> No vendemos ni compartimos tu
                    información con fines comerciales sin tu consentimiento
                    expreso.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Derechos ARCO */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="flex items-center gap-3 text-green-800">
                <AlertTriangle className="h-6 w-6" />
                Tus Derechos ARCO
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 text-slate-700">
                <p>Tienes derecho a:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">
                          A
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">Acceso</h4>
                        <p className="text-sm">
                          Conocer qué datos tenemos sobre ti
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">
                          R
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          Rectificación
                        </h4>
                        <p className="text-sm">
                          Corregir datos inexactos o incompletos
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">
                          C
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          Cancelación
                        </h4>
                        <p className="text-sm">
                          Eliminar datos cuando ya no sean necesarios
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">
                          O
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          Oposición
                        </h4>
                        <p className="text-sm">
                          Oponerte al tratamiento de tus datos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-6">
                  <p className="text-green-800">
                    <strong>Para ejercer tus derechos:</strong> Contacta a
                    nuestro responsable de protección de datos en
                    info@notaria3tijuana.com o al (664) 123-4567
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medidas de Seguridad */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100">
              <CardTitle className="flex items-center gap-3 text-red-800">
                <Shield className="h-6 w-6" />
                Medidas de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 text-slate-700">
                <p>
                  Implementamos las siguientes medidas para proteger tu
                  información:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Encriptación de datos sensibles</li>
                  <li>Acceso restringido a personal autorizado</li>
                  <li>Copias de seguridad regulares</li>
                  <li>Capacitación constante del personal</li>
                  <li>Auditorías de seguridad periódicas</li>
                  <li>Protocolos de respuesta a incidentes</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contacto */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-slate-50 to-slate-100">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                ¿Tienes Preguntas sobre tu Privacidad?
              </h3>
              <p className="text-slate-600 mb-6">
                Nuestro equipo está disponible para resolver cualquier duda
                sobre el tratamiento de tus datos personales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:info@notaria3tijuana.com?subject=Consulta sobre Aviso de Privacidad&body=Hola, tengo una consulta sobre el aviso de privacidad:"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail className="h-5 w-5" />
                  Enviar Email
                </a>
                <a
                  href="tel:+526641234567"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  Llamar Ahora
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
