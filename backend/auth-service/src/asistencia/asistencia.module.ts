import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsistenciaController } from './asistencia.controller';
import { AsistenciaService } from './asistencia.service';
import { TareasController } from './tareas.controller';
import { TareasService } from './tareas.service';
import { RegistroAsistencia } from './entities/registro-asistencia.entity';
import { Tarea } from './entities/tarea.entity';
import { TareaAsignada } from './entities/tarea-asignada.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RegistroAsistencia,
      Tarea,
      TareaAsignada,
    ]),
  ],
  controllers: [AsistenciaController, TareasController],
  providers: [AsistenciaService, TareasService],
  exports: [AsistenciaService, TareasService],
})
export class AsistenciaModule {}
