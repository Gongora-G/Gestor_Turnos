import { PartialType } from '@nestjs/mapped-types';
import { CreateCaddieDto } from './create-caddie.dto';

export class UpdateCaddieDto extends PartialType(CreateCaddieDto) {}