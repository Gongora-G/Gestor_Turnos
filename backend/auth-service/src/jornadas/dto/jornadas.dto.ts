import { IsString, IsBoolean, IsArray, IsOptional, IsNumber, IsEnum, Matches, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export type DiaSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

// ==========================================
// DTOs PARA JORNADA_CONFIG
// ==========================================
export class CreateJornadaConfigDto {
  @IsInt()
  configuracionId: number;

  @IsString()
  codigo: string;

  @IsString()
  nombre: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'horaInicio debe tener formato HH:MM:SS'
  })
  horaInicio: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'horaFin debe tener formato HH:MM:SS'
  })
  horaFin: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'color debe ser un código hexadecimal válido'
  })
  color?: string;

  @IsOptional()
  @IsNumber()
  orden?: number;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;

  @IsOptional()
  @IsString()
  descripcion?: string;
}

export class UpdateJornadaConfigDto {
  @IsOptional()
  @IsString()
  codigo?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
  horaInicio?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
  horaFin?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  color?: string;

  @IsOptional()
  @IsNumber()
  orden?: number;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;

  @IsOptional()
  @IsString()
  descripcion?: string;
}

// ==========================================
// DTOs PARA CONFIGURACION_JORNADAS
// ==========================================
export class ConfiguracionJornadasDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  esquemaTipo: string;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}

export class ConfiguracionJornadasCompletaDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  esquema_tipo: string;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JornadaConfigSimpleDto)
  jornadas: JornadaConfigSimpleDto[];
}

export class JornadaConfigSimpleDto {
  @IsOptional()
  @IsString()
  codigo?: string;

  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'horaInicio debe tener formato HH:MM o HH:MM:SS'
  })
  horaInicio: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'horaFin debe tener formato HH:MM o HH:MM:SS'
  })
  horaFin: string;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'], { each: true })
  diasSemana?: DiaSemana[];

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  color?: string;

  @IsOptional()
  @IsNumber()
  orden?: number;
}

// ==========================================
// DTOs DE RESPUESTA
// ==========================================
export class JornadaConfigResponseDto {
  id: number;
  configuracionId: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  horaInicio: string;
  horaFin: string;
  color: string;
  orden: number;
  activa: boolean;
  clubId?: string;
  configuradoPor?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ConfiguracionJornadasResponseDto {
  id: number;
  nombre: string;
  descripcion?: string;
  esquemaTipo: string;
  activa: boolean;
  clubId?: string;
  jornadaActualId?: string;
  rotacionAutomatica?: boolean;
  configuradoPor?: string;
  createdAt: Date;
  updatedAt: Date;
  jornadas?: JornadaConfigResponseDto[];
}
