import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { Turno } from './entities/turno.entity';
import { Cancha } from '../configuracion/entities/cancha.entity';
import { Socio } from '../socios/entities/socio.entity';
import { TipoMembresia } from '../configuracion/entities/tipo-membresia.entity';
import { JornadasModule } from '../jornadas/jornadas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Turno, Cancha, Socio, TipoMembresia]),
    forwardRef(() => JornadasModule)
  ],
  controllers: [TurnosController],
  providers: [TurnosService],
  exports: [TurnosService],
})
export class TurnosModule {}