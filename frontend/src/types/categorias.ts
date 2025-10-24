export interface CategoriaSocio {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  activo: boolean;
  orden: number;
  created_at: string;
  updated_at: string;
}

export interface SocioConCategoria {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documento: string;
  tipo_documento: 'cedula' | 'pasaporte' | 'extranjeria';
  fecha_nacimiento: string;
  direccion: string;
  categoria_id: string;
  categoria?: CategoriaSocio;
  fecha_ingreso: string;
  estado: 'activo' | 'inactivo' | 'suspendido';
  observaciones: string;
  club_id: string;
  created_at: string;
  updated_at: string;
}

export interface FormCategoriaSocio {
  nombre: string;
  descripcion: string;
  color: string;
}

// Categorías predeterminadas para clubes de tenis
export const CATEGORIAS_PREDETERMINADAS: Omit<CategoriaSocio, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    nombre: 'Socio Propietario',
    descripcion: 'Socios con derechos de propiedad sobre el club',
    color: '#fbbf24',
    activo: true,
    orden: 1
  },
  {
    nombre: 'Socio Regular',
    descripcion: 'Socios con membresía completa del club',
    color: '#3b82f6',
    activo: true,
    orden: 2
  },
  {
    nombre: 'Socio Juvenil',
    descripcion: 'Socios menores de edad o estudiantes',
    color: '#10b981',
    activo: true,
    orden: 3
  },
  {
    nombre: 'Beneficiario',
    descripcion: 'Familiares de socios con derechos limitados',
    color: '#8b5cf6',
    activo: true,
    orden: 4
  },
  {
    nombre: 'Invitado',
    descripcion: 'Visitantes temporales acompañados por socios',
    color: '#6b7280',
    activo: true,
    orden: 5
  }
];