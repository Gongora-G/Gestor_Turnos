import { IsString, IsOptional, IsBoolean, IsNumber, IsEmail, IsUrl, Length, Min, Max } from 'class-validator';

export class UpdateConfiguracionClubDto {
  // Información básica
  @IsOptional()
  @IsString()
  @Length(1, 200)
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  direccion?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  sitio_web?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  logo_url?: string;

  // Configuraciones de horarios
  @IsOptional()
  @IsString()
  hora_apertura?: string;

  @IsOptional()
  @IsString()
  hora_cierre?: string;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(240)
  duracion_turno_minutos?: number;

  // Configuraciones de reservas
  @IsOptional()
  @IsBoolean()
  reservas_automaticas?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  limite_reservas_usuario?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(90)
  anticipacion_maxima_dias?: number;

  // Configuraciones de notificaciones
  @IsOptional()
  @IsBoolean()
  notificaciones_email?: boolean;

  @IsOptional()
  @IsBoolean()
  recordatorios_activos?: boolean;

  // Configuraciones del sistema
  @IsOptional()
  @IsBoolean()
  backup_automatico?: boolean;

  @IsOptional()
  @IsBoolean()
  modo_mantenimiento?: boolean;
}