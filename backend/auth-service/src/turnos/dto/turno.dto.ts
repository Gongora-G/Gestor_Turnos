import { IsString, IsUUID, IsOptional, IsEnum, IsDateString } from 'class-validator';
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
}