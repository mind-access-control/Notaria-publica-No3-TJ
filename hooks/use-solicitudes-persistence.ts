// Hook personalizado para manejar la persistencia de solicitudes
import { useState, useEffect } from "react";
import {
  indexedDBPersistence,
  SolicitudPersistente,
} from "@/lib/indexeddb-persistence";

export const useSolicitudesPersistence = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudPersistente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar todas las solicitudes
  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Inicializar datos por defecto si no existen
      await indexedDBPersistence.initializeDefaultData();

      // Cargar solicitudes persistentes
      const solicitudesData = await indexedDBPersistence.getSolicitudes();
      setSolicitudes(solicitudesData);
    } catch (err) {
      console.error("Error cargando solicitudes:", err);
      setError("Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  // Cargar una solicitud específica
  const loadSolicitud = async (
    numeroSolicitud: string
  ): Promise<SolicitudPersistente | null> => {
    try {
      setError(null);
      return await indexedDBPersistence.getSolicitud(numeroSolicitud);
    } catch (err) {
      console.error("Error cargando solicitud:", err);
      setError("Error al cargar la solicitud");
      return null;
    }
  };

  // Actualizar documentos
  const updateDocumentos = async (
    numeroSolicitud: string,
    documentos: any[]
  ) => {
    try {
      await indexedDBPersistence.updateDocumentos(numeroSolicitud, documentos);
      // Recargar las solicitudes para reflejar los cambios
      await loadSolicitudes();
    } catch (err) {
      console.error("Error actualizando documentos:", err);
      setError("Error al actualizar documentos");
    }
  };

  // Agregar pago
  const addPago = async (numeroSolicitud: string, pago: any) => {
    try {
      await indexedDBPersistence.addPago(numeroSolicitud, pago);
      // Recargar las solicitudes para reflejar los cambios
      await loadSolicitudes();
    } catch (err) {
      console.error("Error agregando pago:", err);
      setError("Error al procesar el pago");
    }
  };

  // Actualizar estado
  const updateEstado = async (numeroSolicitud: string, nuevoEstado: string) => {
    try {
      await indexedDBPersistence.updateEstado(numeroSolicitud, nuevoEstado);
      // Recargar las solicitudes para reflejar los cambios
      await loadSolicitudes();
    } catch (err) {
      console.error("Error actualizando estado:", err);
      setError("Error al actualizar estado");
    }
  };

  // Agregar al historial
  const addHistorial = async (numeroSolicitud: string, entrada: any) => {
    try {
      await indexedDBPersistence.addHistorial(numeroSolicitud, entrada);
    } catch (err) {
      console.error("Error agregando historial:", err);
      setError("Error al agregar historial");
    }
  };

  // Generar número de solicitud único
  const generateSolicitudNumber = async () => {
    return await indexedDBPersistence.generateSolicitudNumber();
  };

  // Crear nueva solicitud
  const createSolicitud = async (
    numeroSolicitud: string,
    tipoTramite: string,
    costoTotal: number = 25000
  ) => {
    try {
      await indexedDBPersistence.createSolicitud(
        numeroSolicitud,
        tipoTramite,
        costoTotal
      );
      // Recargar las solicitudes para reflejar los cambios
      await loadSolicitudes();
    } catch (err) {
      console.error("Error creando solicitud:", err);
      setError("Error al crear la solicitud");
    }
  };

  // Cargar solicitudes al montar el componente
  useEffect(() => {
    loadSolicitudes();
  }, []);

  // Limpiar todos los datos (para desarrollo/testing)
  const clearAllData = async () => {
    try {
      await indexedDBPersistence.clearAllData();
      setSolicitudes([]);
      console.log("Todos los datos han sido eliminados");
    } catch (err) {
      console.error("Error limpiando datos:", err);
      setError("Error al limpiar los datos");
    }
  };

  return {
    solicitudes,
    loading,
    error,
    loadSolicitudes,
    loadSolicitud,
    updateDocumentos,
    addPago,
    updateEstado,
    addHistorial,
    createSolicitud,
    generateSolicitudNumber,
    clearAllData,
  };
};
