/**
 * Utilidades para formatear números y moneda mexicana
 */

/**
 * Formatea un número como moneda mexicana (pesos)
 * @param amount - Cantidad a formatear
 * @returns String formateado como moneda mexicana
 */
export const formatPesoMexicano = (amount: number): string => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formatea un número con separadores de miles mexicanos
 * @param amount - Cantidad a formatear
 * @returns String formateado con separadores mexicanos
 */
export const formatNumberMexicano = (amount: number): string => {
  return new Intl.NumberFormat("es-MX").format(amount);
};

/**
 * Formatea un porcentaje mexicano
 * @param percentage - Porcentaje a formatear
 * @returns String formateado como porcentaje
 */
export const formatPorcentajeMexicano = (percentage: number): string => {
  return new Intl.NumberFormat("es-MX", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(percentage / 100);
};

/**
 * Formatea una fecha mexicana
 * @param date - Fecha a formatear
 * @returns String formateado como fecha mexicana
 */
export const formatFechaMexicana = (date: Date | string): string => {
  const fecha = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(fecha);
};
