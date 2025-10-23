import { IsString, IsOptional, IsBoolean, IsNumber, Length, IsIn } from 'class-validator';

export class CreateCanchaDto {
  @IsString()
  @Length(1, 100)
  nombre: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  ubicacion?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  capacidad?: number = 4;

  @IsOptional()
  @IsBoolean()
  activa?: boolean = true;

  @IsOptional()
  @IsString()
  @IsIn(['tenis', 'paddle', 'futbol', 'squash', 'otro'])
  tipo?: string;

  @IsOptional()
  @IsNumber()
  precio_hora?: number;
}

export class UpdateCanchaDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  ubicacion?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  capacidad?: number;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['tenis', 'paddle', 'futbol', 'squash', 'otro'])
  tipo?: string;

  @IsOptional()
  @IsNumber()
  precio_hora?: number;
}