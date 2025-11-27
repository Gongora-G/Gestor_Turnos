import { IsString, IsUUID, IsOptional, IsEnum, IsDateString, IsInt, IsArray } from 'class-validator';
import { EstadoTurno } from '../entities/turno.entity';

export class CreateTurnoDto {
  @IsDateString()
  fecha: string;

  @IsString()
  hora_inicio: string;

  @IsString()
  hora_fin: string;

  @IsUUID()
  cancha_id: string;

  @IsOptional()
  @IsUUID()
  usuario_id?: string;

  @IsOptional()
  @IsUUID()
  socio_id?: string;

  @IsOptional()
  @IsUUID()
  caddie_id?: string;

  @IsOptional()
  @IsUUID()
  boleador_id?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  personal_asignado?: string[];

  @IsOptional()
  @IsInt()
  jornada_config_id?: number;

  @IsOptional()
  @IsInt()
  jornada_id?: number; // ✅ jornada_id es un número entero, no UUID

  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class UpdateTurnoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  hora_inicio?: string;

  @IsOptional()
  @IsString()
  hora_fin?: string;

  @IsOptional()
  @IsUUID()
  cancha_id?: string;

  @IsOptional()
  @IsUUID()
  caddie_id?: string;

  @IsOptional()
  @IsUUID()
  boleador_id?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  personal_asignado?: string[];

  @IsOptional()
  @IsEnum(EstadoTurno)
  estado?: EstadoTurno;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class FiltrosTurnosDto {
  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @IsOptional()
  @IsUUID()
  cancha_id?: string;

  @IsOptional()
  @IsEnum(EstadoTurno)
  estado?: EstadoTurno;

  @IsOptional()
  @IsUUID()
  usuario_id?: string;

  @IsOptional()
  @IsUUID()
  socio_id?: string;

  @IsOptional()
  @IsUUID()
  jornada_activa_id?: string;

  @IsOptional()
  incluir_todas_las_jornadas?: boolean;

  @IsOptional()
  incluir_guardados?: boolean;
}