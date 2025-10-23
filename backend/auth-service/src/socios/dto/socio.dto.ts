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
  @IsDateString()
  fecha_nacimiento?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsUUID()
  tipo_membresia_id: string;

  @IsDateString()
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
  @IsDateString()
  fecha_nacimiento?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsUUID()
  tipo_membresia_id?: string;

  @IsOptional()
  @IsDateString()
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
  @IsUUID()
  tipo_membresia_id?: string;

  @IsOptional()
  @IsEnum(EstadoSocio)
  estado?: EstadoSocio;

  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;
}