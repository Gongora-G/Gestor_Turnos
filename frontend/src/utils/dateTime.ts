// Utilidades para formateo de fechas y horas

/**
 * Convierte hora en formato 24h a formato 12h con AM/PM
 * @param time24 Hora en formato "HH:MM" (ej: "14:30")
 * @returns Hora en formato 12h con AM/PM (ej: "2:30 PM")
 */
export const formatTo12Hour = (time24: string): string => {
  if (!time24) return '';
  
  const [hours, minutes] = time24.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) return time24;
  
  const period = hours >= 12 ? 'PM' : 'AM';
  let displayHour = hours % 12;
  
  // Si es 0 (medianoche o mediodía), mostrar como 12
  if (displayHour === 0) {
    displayHour = 12;
  }
  
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Convierte hora en formato 12h a formato 24h
 * @param time12 Hora en formato "H:MM AM/PM" (ej: "2:30 PM")
 * @returns Hora en formato 24h "HH:MM" (ej: "14:30")
 */
export const formatTo24Hour = (time12: string): string => {
  if (!time12) return '';
  
  const [time, period] = time12.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) return time12;
  
  let hour24 = hours;
  
  if (period === 'PM' && hours !== 12) {
    hour24 = hours + 12;
  } else if (period === 'AM' && hours === 12) {
    hour24 = 0;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Formatea una fecha completa a formato español amigable
 * @param dateString Fecha en formato ISO o similar
 * @returns Fecha formateada (ej: "22 de octubre, 2025")
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

/**
 * Formatea una fecha a formato corto
 * @param dateString Fecha en formato ISO o similar  
 * @returns Fecha formateada (ej: "22/10/2025")
 */
export const formatDateShort = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('es-ES');
  } catch {
    return dateString;
  }
};

/**
 * Obtiene el día de la semana en español
 * @param dateString Fecha en formato ISO o similar
 * @returns Día de la semana (ej: "martes")
 */
export const getDayOfWeek = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('es-ES', { weekday: 'long' });
  } catch {
    return '';
  }
};

/**
 * Verifica si una fecha es hoy
 * @param dateString Fecha en formato ISO o similar
 * @returns true si la fecha es hoy
 */
export const isToday = (dateString: string): boolean => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    
    return date.toDateString() === today.toDateString();
  } catch {
    return false;
  }
};

/**
 * Verifica si una fecha es mañana
 * @param dateString Fecha en formato ISO o similar
 * @returns true si la fecha es mañana
 */
export const isTomorrow = (dateString: string): boolean => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return date.toDateString() === tomorrow.toDateString();
  } catch {
    return false;
  }
};