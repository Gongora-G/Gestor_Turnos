import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadoPersonalDto } from './create-estado-personal.dto';

export class UpdateEstadoPersonalDto extends PartialType(CreateEstadoPersonalDto) {}
