/**
 * Utilidades para manejo de formato de horas 12h (AM/PM)
 */

export interface TimeFormat12h {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}

export interface TimeFormat24h {
  hour: number;
  minute: number;
}

/**
 * Convierte hora de 24h a 12h (AM/PM)
 * @param time24 Hora en formato 24h (ej: "14:30" o {hour: 14, minute: 30})
 * @returns Objeto con formato 12h
 */
export const convertTo12h = (time24: string | TimeFormat24h): TimeFormat12h => {
  let hour24: number;
  let minute: number;

  if (typeof time24 === 'string') {
    const [h, m] = time24.split(':').map(Number);
    hour24 = h;
    minute = m;
  } else {
    hour24 = time24.hour;
    minute = time24.minute;
  }

  const period: 'AM' | 'PM' = hour24 >= 12 ? 'PM' : 'AM';
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;

  return { hour: hour12, minute, period };
};

/**
 * Convierte hora de 12h (AM/PM) a 24h
 * @param time12 Hora en formato 12h
 * @returns String en formato 24h (HH:MM)
 */
export const convertTo24h = (time12: TimeFormat12h): string => {
  let hour24 = time12.hour;
  
  if (time12.period === 'AM' && hour24 === 12) {
    hour24 = 0;
  } else if (time12.period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  }

  return `${hour24.toString().padStart(2, '0')}:${time12.minute.toString().padStart(2, '0')}`;
};

/**
 * Formatea una hora para mostrar en formato 12h
 * @param time24 Hora en formato 24h (string)
 * @returns String formateado (ej: "2:30 PM")
 */
export const formatTime12h = (time24: string): string => {
  const time12 = convertTo12h(time24);
  return `${time12.hour}:${time12.minute.toString().padStart(2, '0')} ${time12.period}`;
};

/**
 * Formatea una fecha completa con hora en formato 12h
 * @param dateTime Fecha y hora en formato ISO o Date
 * @returns String formateado (ej: "24/10/2025 2:30 PM")
 */
export const formatDateTime12h = (dateTime: string | Date): string => {
  const date = new Date(dateTime);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  const hour24 = date.getHours();
  const minute = date.getMinutes();
  const time12 = convertTo12h({ hour: hour24, minute });
  
  return `${day}/${month}/${year} ${time12.hour}:${time12.minute.toString().padStart(2, '0')} ${time12.period}`;
};

/**
 * Obtiene la hora actual en formato 12h
 * @returns Objeto TimeFormat12h con la hora actual
 */
export const getCurrentTime12h = (): TimeFormat12h => {
  const now = new Date();
  return convertTo12h({ hour: now.getHours(), minute: now.getMinutes() });
};

/**
 * Formatea solo la hora actual para mostrar
 * @returns String con hora actual (ej: "2:30 PM")
 */
export const getCurrentTimeString12h = (): string => {
  const now = new Date();
  const time24 = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  return formatTime12h(time24);
};

/**
 * Valida si una hora en formato 12h es válida
 * @param time12 Objeto TimeFormat12h
 * @returns boolean
 */
export const isValidTime12h = (time12: TimeFormat12h): boolean => {
  return (
    time12.hour >= 1 && 
    time12.hour <= 12 && 
    time12.minute >= 0 && 
    time12.minute <= 59 &&
    (time12.period === 'AM' || time12.period === 'PM')
  );
};

/**
 * Genera opciones de hora para selects (cada 30 minutos)
 * @returns Array de objetos con value (24h) y label (12h)
 */
export const generateTimeOptions = (): Array<{ value: string; label: string }> => {
  const options: Array<{ value: string; label: string }> = [];
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const time12 = formatTime12h(time24);
      
      options.push({
        value: time24,
        label: time12
      });
    }
  }
  
  return options;
};

/**
 * Parsea una hora en string y devuelve componentes 12h
 * @param timeString Hora como string (puede ser 24h o 12h)
 * @returns TimeFormat12h o null si es inválida
 */
export const parseTimeString = (timeString: string): TimeFormat12h | null => {
  try {
    // Si contiene AM/PM, ya está en formato 12h
    if (timeString.includes('AM') || timeString.includes('PM')) {
      const [time, period] = timeString.split(' ');
      const [hour, minute] = time.split(':').map(Number);
      
      return {
        hour,
        minute,
        period: period as 'AM' | 'PM'
      };
    }
    
    // Si no, asumir que está en formato 24h
    return convertTo12h(timeString);
  } catch (error) {
    console.error('Error parsing time string:', error);
    return null;
  }
};