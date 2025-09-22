"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Download, 
  CheckCircle, 
  Clock,
  Receipt,
  Building,
  User,
  Calendar,
  DollarSign,
  AlertCircle,
  Printer,
  Eye,
  X,
  Check
} from "lucide-react";

interface PostFirmaExpedienteCardProps {
  expediente: {
    id: string;
    numeroSolicitud: string;
    tipoTramite?: string;
    comprador: {
      nombre: string;
      apellidoPaterno: string;
    };
    vendedor: {
      nombre: string;
      apellidoPaterno: string;
    };
    inmueble: {
      tipo: string;
      superficie: number;
    };
    fechaCreacion: string;
  };
  onExpedienteArchivado?: (expedienteId: string) => void;
}

export function PostFirmaExpedienteCard({ expediente, onExpedienteArchivado }: PostFirmaExpedienteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [copiasEntregadas, setCopiasEntregadas] = useState(false);
  const [expedienteArchivado, setExpedienteArchivado] = useState(false);

  // Datos reales para documentos e impuestos post-firma agrupados por entidad
  const documentosPostFirma = [
    {
      entidad: "Registro Público de la Propiedad y del Comercio (RPPC) de B.C.",
      entidadCorta: "RPPC de B.C.",
      items: [
        {
          id: "testimonio-escritura",
          nombre: "Testimonio de la escritura de compraventa (para inscripción)",
          tipo: "documento",
          estado: "pendiente",
          fechaVencimiento: "2025-02-15",
          descripcion: "Documento oficial para inscripción en el RPPC"
        },
        {
          id: "solicitud-inscripcion",
          nombre: "Solicitud/formato de inscripción + anexos",
          tipo: "documento",
          estado: "pendiente",
          fechaVencimiento: "2025-02-15",
          descripcion: "Identificaciones, avalúo, predial/agua al corriente, etc."
        },
        {
          id: "derechos-registrales",
          nombre: "Derechos registrales por inscripción",
          tipo: "impuesto",
          estado: "pendiente",
          fechaVencimiento: "2025-02-15",
          descripcion: "Pago de derechos/servicios registrales (compraventa y, en su caso, hipoteca)"
        },
        {
          id: "testimonio-hipoteca",
          nombre: "Testimonio de hipoteca (para inscripción)",
          tipo: "documento",
          estado: "condicional",
          fechaVencimiento: "2025-02-15",
          descripcion: "Solo si hay crédito"
        }
      ]
    },
    {
      entidad: "Catastro Municipal de Tijuana (Dirección de Catastro)",
      entidadCorta: "Catastro Municipal",
      items: [
        {
          id: "aviso-catastral",
          nombre: "Aviso/Trámite catastral por traslado de dominio",
          tipo: "documento",
          estado: "pendiente",
          fechaVencimiento: "2025-02-20",
          descripcion: "Alta/actualización de cuenta catastral"
        }
      ]
    },
    {
      entidad: "Ayuntamiento de Tijuana / Tesorería",
      entidadCorta: "Ayuntamiento de Tijuana",
      items: [
        {
          id: "comprobante-isai",
          nombre: "Comprobante de pago del ISAI",
          tipo: "documento",
          estado: "pendiente",
          fechaVencimiento: "2025-02-18",
          descripcion: "Para integrar al expediente y a Catastro/RPPC"
        },
        {
          id: "isai",
          nombre: "ISAI (Impuesto sobre Adquisición de Inmuebles)",
          tipo: "impuesto",
          estado: "pendiente",
          fechaVencimiento: "2025-02-18",
          descripcion: "Impuesto municipal; declaración y pago en línea/referenciado"
        }
      ]
    },
    {
      entidad: "SAT (vía sistema de fedatarios)",
      entidadCorta: "SAT",
      items: [
        {
          id: "aviso-enajenacion",
          nombre: "Aviso notarial de enajenación",
          tipo: "documento",
          estado: "condicional",
          fechaVencimiento: "2025-02-25",
          descripcion: "Datos de la operación (obligación fiscal)"
        },
        {
          id: "isr-enajenacion",
          nombre: "ISR por enajenación",
          tipo: "impuesto",
          estado: "condicional",
          fechaVencimiento: "2025-02-25",
          descripcion: "Solo si aplica; el notario calcula, retiene y entera o aplica exención de casa habitación"
        }
      ]
    }
  ];

  const getTramiteTitle = (tipoTramite?: string) => {
    const titles: Record<string, string> = {
      compraventa: "Compraventa",
      testamento: "Testamento",
      donacion: "Donación",
      poder: "Poder"
    };
    return tipoTramite ? (titles[tipoTramite] || tipoTramite) : "Trámite";
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "completado":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><CheckCircle className="h-3 w-3 mr-1" />Completado</Badge>;
      case "pendiente":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case "condicional":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><AlertCircle className="h-3 w-3 mr-1" />Condicional</Badge>;
      default:
        return <Badge variant="outline">Sin estado</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "documento":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "impuesto":
        return <Receipt className="h-4 w-4 text-emerald-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    if (item.tipo === "impuesto") {
      setShowReceiptModal(true);
    } else {
      setShowDocumentModal(true);
    }
  };

  const handleCloseModals = () => {
    setShowReceiptModal(false);
    setShowDocumentModal(false);
    setSelectedItem(null);
  };

  const handleToggleCompleted = (itemId: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleToggleAllCompleted = () => {
    const allItemIds = documentosPostFirma.flatMap(entidad => entidad.items.map(item => item.id));
    const allCompleted = allItemIds.every(id => completedItems[id]);
    
    if (allCompleted) {
      // Desmarcar todos
      setCompletedItems({});
    } else {
      // Marcar todos
      const newCompletedItems: Record<string, boolean> = {};
      allItemIds.forEach(id => {
        newCompletedItems[id] = true;
      });
      setCompletedItems(newCompletedItems);
    }
  };

  const handleToggleCopiasEntregadas = () => {
    setCopiasEntregadas(!copiasEntregadas);
  };

  const handleArchivarExpediente = () => {
    setExpedienteArchivado(true);
    console.log(`Expediente ${expediente.numeroSolicitud} archivado exitosamente`);
    // Notificar al componente padre que el expediente fue archivado
    if (onExpedienteArchivado) {
      onExpedienteArchivado(expediente.id);
    }
  };

  // Verificar si todos los documentos están completados
  const allDocumentsCompleted = () => {
    const allItemIds = documentosPostFirma.flatMap(entidad => entidad.items.map(item => item.id));
    return allItemIds.every(id => completedItems[id]);
  };

  return (
    <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow bg-white">
      <CardHeader 
        className="cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {getTramiteTitle(expediente.tipoTramite)} - {expediente.inmueble.tipo}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {expediente.numeroSolicitud} • {expediente.inmueble.superficie}m²
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {expediente.comprador.nombre} {expediente.comprador.apellidoPaterno} → {expediente.vendedor.nombre} {expediente.vendedor.apellidoPaterno}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completado
            </Badge>
            <Button variant="ghost" size="sm">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Resumen de documentos e impuestos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {documentosPostFirma.reduce((total, entidad) => 
                    total + entidad.items.filter(item => item.tipo === "documento").length, 0)}
                </div>
                <p className="text-sm text-gray-600">Documentos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {documentosPostFirma.reduce((total, entidad) => 
                    total + entidad.items.filter(item => item.tipo === "impuesto").length, 0)}
                </div>
                <p className="text-sm text-gray-600">Impuestos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {documentosPostFirma.reduce((total, entidad) => 
                    total + entidad.items.filter(item => !completedItems[item.id] && item.estado === "pendiente").length, 0)}
                </div>
                <p className="text-sm text-gray-600">Pendientes</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {Object.values(completedItems).filter(Boolean).length}
                </div>
                <p className="text-sm text-gray-600">Completados</p>
              </div>
            </div>

            {/* Checkbox para marcar todos */}
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleAllCompleted}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    (() => {
                      const allItemIds = documentosPostFirma.flatMap(entidad => entidad.items.map(item => item.id));
                      const allCompleted = allItemIds.every(id => completedItems[id]);
                      const someCompleted = allItemIds.some(id => completedItems[id]);
                      
                      if (allCompleted) {
                        return 'bg-blue-500 border-blue-500 text-white';
                      } else if (someCompleted) {
                        return 'bg-blue-200 border-blue-400 text-blue-600';
                      } else {
                        return 'border-blue-300 hover:border-blue-400';
                      }
                    })()
                  }`}
                >
                  {(() => {
                    const allItemIds = documentosPostFirma.flatMap(entidad => entidad.items.map(item => item.id));
                    const allCompleted = allItemIds.every(id => completedItems[id]);
                    return allCompleted && <Check className="h-4 w-4" />;
                  })()}
                </button>
                <div>
                  <p className="font-semibold text-blue-900">
                    {(() => {
                      const allItemIds = documentosPostFirma.flatMap(entidad => entidad.items.map(item => item.id));
                      const allCompleted = allItemIds.every(id => completedItems[id]);
                      const someCompleted = allItemIds.some(id => completedItems[id]);
                      
                      if (allCompleted) {
                        return 'Todos completados';
                      } else if (someCompleted) {
                        return 'Algunos completados';
                      } else {
                        return 'Marcar todos como completados';
                      }
                    })()}
                  </p>
                  <p className="text-sm text-blue-700">
                    {(() => {
                      const allItemIds = documentosPostFirma.flatMap(entidad => entidad.items.map(item => item.id));
                      const completedCount = allItemIds.filter(id => completedItems[id]).length;
                      return `${completedCount} de ${allItemIds.length} elementos completados`;
                    })()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600 font-medium">
                  {(() => {
                    const allItemIds = documentosPostFirma.flatMap(entidad => entidad.items.map(item => item.id));
                    const completedCount = allItemIds.filter(id => completedItems[id]).length;
                    const percentage = allItemIds.length > 0 ? Math.round((completedCount / allItemIds.length) * 100) : 0;
                    return `${percentage}% completado`;
                  })()}
                </p>
              </div>
            </div>

            {/* Lista de documentos e impuestos agrupados por entidad */}
            <div className="space-y-6">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documentos e Impuestos por Entidad
              </h4>
              
              {documentosPostFirma.map((entidad) => (
                <div key={entidad.entidad} className="space-y-3">
                  {/* Header de la entidad */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
                    <h5 className="font-semibold text-blue-900">{entidad.entidadCorta}</h5>
                    <p className="text-sm text-blue-700">{entidad.entidad}</p>
                  </div>
                  
                  {/* Items de la entidad */}
                  <div className="space-y-2 ml-4">
                    {entidad.items.map((item) => {
                      const isCompleted = completedItems[item.id] || false;
                      return (
                        <div 
                          key={item.id}
                          className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                            isCompleted ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleCompleted(item.id)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                isCompleted 
                                  ? 'bg-blue-500 border-blue-500 text-white' 
                                  : 'border-gray-300 hover:border-blue-400'
                              }`}
                            >
                              {isCompleted && <Check className="h-3 w-3" />}
                            </button>
                            {getTipoIcon(item.tipo)}
                            <div>
                              <p className={`font-medium ${isCompleted ? 'text-blue-800 line-through' : 'text-gray-900'}`}>
                                {item.nombre}
                              </p>
                              <p className={`text-sm ${isCompleted ? 'text-blue-600' : 'text-gray-600'}`}>
                                {item.descripcion}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  Vence: {new Date(item.fechaVencimiento).toLocaleDateString("es-MX")}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isCompleted ? (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completado
                              </Badge>
                            ) : (
                              getEstadoBadge(item.estado)
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleItemClick(item)}
                            >
                              {item.tipo === "impuesto" ? (
                                <>
                                  <Receipt className="h-3 w-3 mr-1" />
                                  Ver Recibo
                                </>
                              ) : (
                                <>
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ver PDF
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sección de Validación Final - Solo aparece cuando todos los documentos están completados */}
            {allDocumentsCompleted() && (
              <div className="space-y-4">
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    Validación Final - Entrega de Copias
                  </h4>
                  
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleToggleCopiasEntregadas}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            copiasEntregadas 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : 'border-emerald-300 hover:border-emerald-400'
                          }`}
                        >
                          {copiasEntregadas && <Check className="h-4 w-4" />}
                        </button>
                        <div>
                          <p className="font-semibold text-emerald-900">
                            {copiasEntregadas ? 'Copias entregadas' : 'Confirmar entrega de copias del contrato'}
                          </p>
                          <p className="text-sm text-emerald-700">
                            {copiasEntregadas 
                              ? 'Las copias del contrato de compraventa han sido entregadas a las partes'
                              : 'Marque esta casilla cuando haya entregado las copias del contrato a comprador y vendedor'
                            }
                          </p>
                        </div>
                      </div>
                      {copiasEntregadas && (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Entregado
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Botón para archivar expediente - Solo aparece cuando las copias están entregadas */}
                  {copiasEntregadas && !expedienteArchivado && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-semibold text-slate-900 mb-1">
                            Archivar Expediente
                          </h5>
                          <p className="text-sm text-slate-600">
                            El expediente está listo para ser archivado. Esta acción completará el proceso.
                          </p>
                        </div>
                        <Button
                          onClick={handleArchivarExpediente}
                          className="bg-slate-600 hover:bg-slate-700 text-white"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Archivar Expediente
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Estado de expediente archivado */}
                  {expedienteArchivado && (
                    <div className="bg-slate-100 border border-slate-300 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-900">
                            Expediente Archivado
                          </h5>
                          <p className="text-sm text-slate-600">
                            El expediente {expediente.numeroSolicitud} ha sido archivado exitosamente. 
                            El proceso está completo.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-600">
                <p>Fecha de firma: {new Date(expediente.fechaCreacion).toLocaleDateString("es-MX")}</p>
                <p>Próximo vencimiento: {(() => {
                  const todasLasFechas = documentosPostFirma.flatMap(entidad => 
                    entidad.items.map(item => new Date(item.fechaVencimiento))
                  );
                  const fechaMasProxima = new Date(Math.min(...todasLasFechas.map(fecha => fecha.getTime())));
                  return fechaMasProxima.toLocaleDateString("es-MX");
                })()}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Detalles
                </Button>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Todo
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      )}

      {/* Modal para Recibo/Factura */}
      {showReceiptModal && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Recibo de Pago - {selectedItem.nombre}</h3>
                <Button variant="ghost" size="sm" onClick={handleCloseModals}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Header del recibo */}
                <div className="text-center border-b pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Notaría Pública No. 3</h2>
                  <p className="text-gray-600">Tijuana, Baja California</p>
                  <p className="text-sm text-gray-500">RFC: NOT123456789</p>
                </div>

                {/* Información del expediente */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Expediente:</p>
                    <p className="font-medium">{expediente.numeroSolicitud}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha:</p>
                    <p className="font-medium">{new Date().toLocaleDateString("es-MX")}</p>
                  </div>
                </div>

                {/* Detalles del pago */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Detalles del Pago</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Concepto:</span>
                      <span className="font-medium">{selectedItem.nombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Entidad:</span>
                      <span className="font-medium">{documentosPostFirma.find(e => e.items.includes(selectedItem))?.entidadCorta}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estado:</span>
                      <span className="font-medium">{selectedItem.estado}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vencimiento:</span>
                      <span className="font-medium">{new Date(selectedItem.fechaVencimiento).toLocaleDateString("es-MX")}</span>
                    </div>
                  </div>
                </div>

                {/* Monto simulado */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Monto a Pagar:</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      ${(() => {
                        const montos: Record<string, number> = {
                          "derechos-registrales": 2500,
                          "isai": 15000,
                          "isr-enajenacion": 8000
                        };
                        return montos[selectedItem.id] || 5000;
                      })().toLocaleString("es-MX")}
                    </span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Recibo
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Documento PDF */}
      {showDocumentModal && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-xl">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Documento - {selectedItem.nombre}</h3>
                <Button variant="ghost" size="sm" onClick={handleCloseModals}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              {/* Simulación de PDF */}
              <div className="border rounded-lg h-80 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Vista previa del documento PDF</p>
                  <p className="text-sm text-gray-500">{selectedItem.nombre}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Expediente: {expediente.numeroSolicitud}
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
