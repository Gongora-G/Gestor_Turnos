import { IsString, IsBoolean, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CampoPersonalizado } from '../entities/tipo-personal.entity';

export class CreateTipoPersonalDto {
  @IsString()
  nombre: string;

  @IsString()
  codigo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsOptional()
  campos_personalizados?: CampoPersonalizado[];

  @IsString()
  clubId: string;
}

export class UpdateTipoPersonalDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  codigo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsOptional()
  campos_personalizados?: CampoPersonalizado[];
}
