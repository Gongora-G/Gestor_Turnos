import { IsString, IsNumber, IsOptional, IsObject, IsEnum, IsBoolean } from 'class-validator';

export class CreatePersonalDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsNumber()
  tipoPersonalId: number;

  @IsObject()
  @IsOptional()
  datosEspecificos?: Record<string, any>;

  @IsNumber()
  @IsOptional()
  tarifaPorHora?: number;

  @IsEnum(['disponible', 'ocupado', 'descanso', 'inactivo'])
  @IsOptional()
  estado?: 'disponible' | 'ocupado' | 'descanso' | 'inactivo';

  @IsString()
  @IsOptional()
  horariosDisponibles?: string;

  @IsString()
  @IsOptional()
  notas?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsNumber()
  @IsOptional()
  jornadaAsignadaId?: number;

  @IsString()
  clubId: string;
}

export class UpdatePersonalDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellido?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsOptional()
  tipoPersonalId?: number;

  @IsObject()
  @IsOptional()
  datosEspecificos?: Record<string, any>;

  @IsNumber()
  @IsOptional()
  tarifaPorHora?: number;

  @IsEnum(['disponible', 'ocupado', 'descanso', 'inactivo'])
  @IsOptional()
  estado?: 'disponible' | 'ocupado' | 'descanso' | 'inactivo';

  @IsString()
  @IsOptional()
  horariosDisponibles?: string;

  @IsString()
  @IsOptional()
  notas?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsNumber()
  @IsOptional()
  jornadaAsignadaId?: number;
}
