import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { RegistroAsistencia } from '../asistencia/entities/registro-asistencia.entity';
import { Personal } from '../personal/entities/personal.entity';
import { Turno } from '../turnos/entities/turno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroAsistencia, Personal, Turno])],
  controllers: [ReportesController],
  providers: [ReportesService],
  exports: [ReportesService],
})
export class ReportesModule {}
