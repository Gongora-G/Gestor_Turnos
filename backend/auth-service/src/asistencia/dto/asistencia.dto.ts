import { IsString, IsNumber, IsBoolean, IsOptional, IsDate, IsUUID, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class RegistrarAsistenciaDto {
  @IsUUID()
  personalId: string;

  @IsNumber()
  jornadaConfigId: number;

  @IsDateString()
  fecha: string;

  @IsBoolean()
  @IsOptional()
  tareasCompletadas?: boolean;

  @IsString()
  @IsOptional()
  tareasPendientes?: string;

  @IsNumber()
  @IsOptional()
  turnosRealizadosAyer?: number;

  @IsBoolean()
  @IsOptional()
  presente?: boolean;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsUUID()
  @IsOptional()
  clubId?: string;

  @IsUUID()
  @IsOptional()
  registradoPor?: string;
}

export class ActualizarAsistenciaDto {
  @IsBoolean()
  @IsOptional()
  tareasCompletadas?: boolean;

  @IsString()
  @IsOptional()
  tareasPendientes?: string;

  @IsBoolean()
  @IsOptional()
  presente?: boolean;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  horaSalida?: Date;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsNumber()
  @IsOptional()
  ordenCalculado?: number;
}

export class ObtenerAsistenciaDto {
  @IsDate()
  @Type(() => Date)
  fecha: Date;

  @IsNumber()
  @IsOptional()
  jornadaConfigId?: number;

  @IsUUID()
  clubId: string;
}
