import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  FileText,
  Scale,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
} from "lucide-react";

export default function TerminosCondiciones() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Estos términos y condiciones rigen el uso de los servicios de
            Notaría Pública No. 3 Tijuana y establecen los derechos y
            obligaciones entre la notaría y nuestros clientes.
          </p>
          <div className="mt-4 text-sm text-slate-500">
            Última actualización: {new Date().toLocaleDateString("es-MX")}
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Información General */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="flex items-center gap-3 text-blue-800">
                <Scale className="h-6 w-6" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 text-slate-700">
                <p>
                  <strong>Notaría Pública No. 3 Tijuana</strong> es una
                  institución oficial autorizada por el Gobierno del Estado de
                  Baja California para ejercer funciones notariales conforme a
                  la legislación mexicana vigente.
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

          {/* Servicios */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100">
              <CardTitle className="flex items-center gap-3 text-emerald-800">
                <Users className="h-6 w-6" />
                Servicios Ofrecidos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 text-slate-700">
                <p>Ofrecemos los siguientes servicios notariales:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="list-disc list-inside space-y-2">
                    <li>Compraventa de bienes inmuebles</li>
                    <li>Elaboración de testamentos</li>
                    <li>Otorgamiento de poderes</li>
                    <li>Constitución de sociedades</li>
                    <li>Actos familiares</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Certificaciones</li>
                    <li>Legalizaciones</li>
                    <li>Protocolizaciones</li>
                    <li>Asesoría jurídica</li>
                    <li>Servicios especializados</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Obligaciones del Cliente */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
              <CardTitle className="flex items-center gap-3 text-orange-800">
                <AlertCircle className="h-6 w-6" />
                Obligaciones del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 text-slate-700">
                <p>El cliente se compromete a:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Proporcionar información veraz y completa</li>
                  <li>Presentar documentos originales y válidos</li>
                  <li>Cumplir con los pagos en tiempo y forma</li>
                  <li>Seguir las instrucciones del notario</li>
                  <li>Respetar los horarios de atención acordados</li>
                  <li>Informar cualquier cambio en sus datos</li>
                  <li>Colaborar en el proceso notarial</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Obligaciones de la Notaría */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="flex items-center gap-3 text-green-800">
                <CheckCircle className="h-6 w-6" />
                Obligaciones de la Notaría
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 text-slate-700">
                <p>Nos comprometemos a:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Prestar servicios profesionales y de calidad</li>
                  <li>Mantener la confidencialidad de la información</li>
                  <li>Cumplir con la legislación notarial vigente</li>
                  <li>Proporcionar asesoría jurídica especializada</li>
                  <li>Expedir documentos en tiempo razonable</li>
                  <li>Mantener archivos seguros y organizados</li>
                  <li>Respetar los derechos del cliente</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Tiempos y Costos */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="flex items-center gap-3 text-purple-800">
                <Clock className="h-6 w-6" />
                Tiempos y Costos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 text-slate-700">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">
                    Tiempos de Elaboración:
                  </h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Testamentos: 1-2 días hábiles</li>
                    <li>Poderes: 1-2 días hábiles</li>
                    <li>Compraventas: 15-30 días hábiles</li>
                    <li>Certificaciones: Mismo día</li>
                    <li>Otros documentos: Según complejidad</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Costos:</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Los costos se determinan según aranceles oficiales</li>
                    <li>Se incluyen honorarios notariales e impuestos</li>
                    <li>Se proporciona cotización previa al servicio</li>
                    <li>Los pagos se realizan antes de la entrega</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitaciones */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100">
              <CardTitle className="flex items-center gap-3 text-red-800">
                <AlertCircle className="h-6 w-6" />
                Limitaciones y Exclusiones
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 text-slate-700">
                <p>La notaría no se hace responsable por:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Información falsa proporcionada por el cliente</li>
                  <li>Documentos falsificados o alterados</li>
                  <li>Retrasos por causas de fuerza mayor</li>
                  <li>Cambios en la legislación posterior al servicio</li>
                  <li>Decisiones judiciales adversas</li>
                  <li>Daños por uso indebido de documentos</li>
                </ul>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-red-800 font-medium">
                    <strong>Importante:</strong> Los servicios notariales están
                    sujetos a la legislación vigente y pueden verse afectados
                    por cambios normativos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modificaciones */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
              <CardTitle className="flex items-center gap-3 text-slate-800">
                <FileText className="h-6 w-6" />
                Modificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 text-slate-700">
                <p>
                  Nos reservamos el derecho de modificar estos términos y
                  condiciones en cualquier momento. Las modificaciones entrarán
                  en vigor inmediatamente después de su publicación en nuestro
                  sitio web.
                </p>
                <p>
                  Es responsabilidad del cliente revisar periódicamente estos
                  términos para estar informado de cualquier cambio.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contacto */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-slate-50 to-slate-100">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                ¿Tienes Preguntas sobre estos Términos?
              </h3>
              <p className="text-slate-600 mb-6">
                Nuestro equipo legal está disponible para aclarar cualquier duda
                sobre estos términos y condiciones.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:info@notaria3tijuana.com?subject=Consulta sobre Términos y Condiciones&body=Hola, tengo una consulta sobre los términos y condiciones:"
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
