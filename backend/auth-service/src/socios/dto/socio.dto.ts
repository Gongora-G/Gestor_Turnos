import { IsString, IsUUID, IsOptional, IsEnum, IsEmail, IsDateString } from 'class-validator';
import { TipoDocumento, EstadoSocio } from '../entities/socio.entity';

export class CreateSocioDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsString()
  documento: string;

  @IsEnum(TipoDocumento)
  tipo_documento: TipoDocumento;

  @IsOptional()
  @IsString()
  fecha_nacimiento?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsString()
  tipo_membresia_id: string;

  @IsString()
  fecha_inicio_membresia: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class UpdateSocioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  documento?: string;

  @IsOptional()
  @IsEnum(TipoDocumento)
  tipo_documento?: TipoDocumento;

  @IsOptional()
  @IsString()
  fecha_nacimiento?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  tipo_membresia_id?: string;

  @IsOptional()
  @IsString()
  fecha_inicio_membresia?: string;

  @IsOptional()
  @IsEnum(EstadoSocio)
  estado?: EstadoSocio;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class FiltrosSociosDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  documento?: string;

  @IsOptional()
  @IsString()
  tipo_membresia_id?: string;

  @IsOptional()
  @IsEnum(EstadoSocio)
  estado?: EstadoSocio;

  @IsOptional()
  @IsString()
  fecha_inicio?: string;

  @IsOptional()
  @IsString()
  fecha_fin?: string;
}