import { IsString, IsOptional, IsBoolean, IsNumber, IsHexColor, Length } from 'class-validator';

export class CreateTipoMembresiaDto {
  @IsString()
  @Length(1, 100)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsHexColor()
  color?: string = '#3b82f6';

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;

  @IsOptional()
  @IsNumber()
  precio?: number;
}

export class UpdateTipoMembresiaDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsNumber()
  precio?: number;
}