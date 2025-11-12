import { IsString, IsNotEmpty, IsOptional, IsEmail, IsNumber, IsBoolean, IsIn, Min, Max } from 'class-validator';

export class CreateBoleadorDto {
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
  @IsIn(['principiante', 'intermedio', 'avanzado', 'profesional'])
  nivel_juego?: string;

  @IsString()
  @IsOptional()
  deportes?: string; // JSON string

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  ranking_habilidad?: number;

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
  preferencias?: string; // JSON string

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