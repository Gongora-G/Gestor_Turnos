import { IsString, IsDate, IsOptional, IsBoolean, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJornadaTurnoDto {
  @IsDate()
  @Type(() => Date)
  fechaJornada: Date;

  @IsString()
  nombreJornada: string;

  @IsObject()
  datosTurnos: any;

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
  usuarioCreacion?: string;
}