import { IsString, IsDate, IsOptional, IsBoolean, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateJornadaTurnoDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fechaJornada?: Date;

  @IsString()
  @IsOptional()
  nombreJornada?: string;

  @IsObject()
  @IsOptional()
  datosTurnos?: any;

  @IsNumber()
  @IsOptional()
  totalTurnos?: number;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsBoolean()
  @IsOptional()
  activa?: boolean;

  @IsString()
  @IsOptional()
  usuarioActualizacion?: string;
}