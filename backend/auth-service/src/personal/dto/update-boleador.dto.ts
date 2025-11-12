import { PartialType } from '@nestjs/mapped-types';
import { CreateBoleadorDto } from './create-boleador.dto';

export class UpdateBoleadorDto extends PartialType(CreateBoleadorDto) {}