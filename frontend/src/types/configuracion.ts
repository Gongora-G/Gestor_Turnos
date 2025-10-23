// Interfaces para la configuración
export interface TipoMembresia {
  id: string;
  nombre: string;
  descripcion?: string;
  color: string;
  activo: boolean;
  precio?: number;
  clubId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cancha {
  id: string;
  nombre: string;
  ubicacion?: string;
  descripcion?: string;
  capacidad: number;
  activa: boolean;
  tipo?: string;
  precio_hora?: number;
  clubId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfiguracionClub {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  sitio_web?: string;
  logo_url?: string;
  hora_apertura: string;
  hora_cierre: string;
  duracion_turno_minutos: number;
  reservas_automaticas: boolean;
  limite_reservas_usuario: number;
  anticipacion_maxima_dias: number;
  notificaciones_email: boolean;
  recordatorios_activos: boolean;
  backup_automatico: boolean;
  modo_mantenimiento: boolean;
  clubId: string;
  createdAt: string;
  updatedAt: string;
}

// DTOs para crear/actualizar
export interface CreateTipoMembresiaDto {
  nombre: string;
  descripcion?: string;
  color?: string;
  activo?: boolean;
  precio?: number;
}

export interface UpdateTipoMembresiaDto {
  nombre?: string;
  descripcion?: string;
  color?: string;
  activo?: boolean;
  precio?: number;
}

export interface CreateCanchaDto {
  nombre: string;
  ubicacion?: string;
  descripcion?: string;
  capacidad?: number;
  activa?: boolean;
  tipo?: string;
  precio_hora?: number;
}

export interface UpdateCanchaDto {
  nombre?: string;
  ubicacion?: string;
  descripcion?: string;
  capacidad?: number;
  activa?: boolean;
  tipo?: string;
  precio_hora?: number;
}

export interface UpdateConfiguracionClubDto {
  nombre?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  sitio_web?: string;
  logo_url?: string;
  hora_apertura?: string;
  hora_cierre?: string;
  duracion_turno_minutos?: number;
  reservas_automaticas?: boolean;
  limite_reservas_usuario?: number;
  anticipacion_maxima_dias?: number;
  notificaciones_email?: boolean;
  recordatorios_activos?: boolean;
  backup_automatico?: boolean;
  modo_mantenimiento?: boolean;
}