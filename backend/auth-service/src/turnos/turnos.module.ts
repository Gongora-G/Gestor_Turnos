import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { Turno } from './entities/turno.entity';
import { Caddie } from './entities/caddie.entity';
import { Boleador } from './entities/boleador.entity';
import { Cancha } from '../configuracion/entities/cancha.entity';
import { Socio } from '../socios/entities/socio.entity';
import { TipoMembresia } from '../configuracion/entities/tipo-membresia.entity';
import { JornadasModule } from '../jornadas/jornadas.module';
import { PersonalModule } from '../personal/personal.module';
import { ConfiguracionModule } from '../configuracion/configuracion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Turno, Caddie, Boleador, Cancha, Socio, TipoMembresia]),
    forwardRef(() => JornadasModule),
    PersonalModule,
    ConfiguracionModule,
  ],
  controllers: [TurnosController],
  providers: [TurnosService],
  exports: [TurnosService],
})
export class TurnosModule {}