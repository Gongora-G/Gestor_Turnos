import { IsString, IsOptional, IsBoolean, IsNumber, IsInt, Length, IsIn } from 'class-validator';

export class CreateTipoSuperficieCanchaDto {
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
  color?: string = '#3B82F6';

  @IsOptional()
  @IsString()
  @IsIn(['rapida', 'media', 'lenta'])
  velocidad?: string = 'media';

  @IsOptional()
  @IsBoolean()
  requiereMantenimientoEspecial?: boolean = false;

  @IsOptional()
  @IsBoolean()
  activa?: boolean = true;

  @IsOptional()
  @IsInt()
  orden?: number = 0;
}

export class UpdateTipoSuperficieCanchaDto {
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
  @IsIn(['rapida', 'media', 'lenta'])
  velocidad?: string;

  @IsOptional()
  @IsBoolean()
  requiereMantenimientoEspecial?: boolean;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;

  @IsOptional()
  @IsInt()
  orden?: number;
}
