import { IsString, IsOptional, IsBoolean, IsHexColor, MaxLength } from 'class-validator';

export class CreateEstadoPersonalDto {
  @IsString()
  @MaxLength(50)
  nombre: string;

  @IsHexColor()
  color: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsBoolean()
  esOcupado?: boolean;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
