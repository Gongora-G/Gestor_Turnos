import { IsString, IsOptional, IsInt, IsBoolean, IsIn } from 'class-validator';

export class CreateTareaDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsInt()
  @IsOptional()
  tiempoEstimado?: number;

  @IsString()
  @IsOptional()
  @IsIn(['alta', 'media', 'baja'])
  prioridad?: string;
}

export class UpdateTareaDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsInt()
  @IsOptional()
  tiempoEstimado?: number;

  @IsString()
  @IsOptional()
  @IsIn(['alta', 'media', 'baja'])
  prioridad?: string;

  @IsBoolean()
  @IsOptional()
  activa?: boolean;
}

export class AsignarTareasDto {
  @IsInt({ each: true })
  tareaIds: number[];
}

export class CompletarTareaDto {
  @IsString()
  @IsOptional()
  notas?: string;
}
