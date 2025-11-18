import { IsString, IsOptional, IsBoolean, IsInt, Length } from 'class-validator';

export class CreateEstadoCanchaDto {
  @IsString()
  @Length(1, 100)
  nombre: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  descripcion?: string;

  @IsOptional()
  @IsString()
  @Length(7, 7)
  color?: string = '#10B981';

  @IsOptional()
  @IsString()
  @Length(0, 50)
  icono?: string;

  @IsOptional()
  @IsBoolean()
  permiteReservas?: boolean = true;

  @IsOptional()
  @IsBoolean()
  visibleEnTurnos?: boolean = true;

  @IsOptional()
  @IsBoolean()
  activa?: boolean = true;

  @IsOptional()
  @IsInt()
  orden?: number = 0;

  @IsOptional()
  @IsBoolean()
  esPredeterminado?: boolean = false;
}

export class UpdateEstadoCanchaDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  descripcion?: string;

  @IsOptional()
  @IsString()
  @Length(7, 7)
  color?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  icono?: string;

  @IsOptional()
  @IsBoolean()
  permiteReservas?: boolean;

  @IsOptional()
  @IsBoolean()
  visibleEnTurnos?: boolean;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;

  @IsOptional()
  @IsInt()
  orden?: number;

  @IsOptional()
  @IsBoolean()
  esPredeterminado?: boolean;
}
