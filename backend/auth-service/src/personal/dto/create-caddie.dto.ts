import { IsString, IsNotEmpty, IsOptional, IsEmail, IsNumber, IsBoolean, IsIn, Min, Max } from 'class-validator';

export class CreateCaddieDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  especialidades?: string; // JSON string

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  nivel_experiencia?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  tarifa_por_hora?: number;

  @IsString()
  @IsOptional()
  @IsIn(['disponible', 'ocupado', 'descanso', 'inactivo'])
  estado?: string;

  @IsString()
  @IsOptional()
  horarios_disponibles?: string; // JSON string

  @IsString()
  @IsOptional()
  notas?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsString()
  @IsNotEmpty()
  clubId: string;
}