import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JornadasController } from './jornadas.controller';
import { JornadasService } from './jornadas.service';
import { 
  JornadaConfig, 
  ConfiguracionJornadas, 
  RegistroJornada,
  RegistroJornadaDiaria,
  RegistroJornadaDetalle,
  JornadaActiva
} from './entities/jornada.entity';
import { Turno } from '../turnos/entities/turno.entity';
import { Cancha } from '../configuracion/entities/cancha.entity';
import { Socio } from '../socios/entities/socio.entity';
import { TipoMembresia } from '../configuracion/entities/tipo-membresia.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConfiguracionJornadas,
      JornadaConfig,
      RegistroJornada,
      RegistroJornadaDiaria,
      RegistroJornadaDetalle,
      JornadaActiva,
      Turno,
      Cancha,
      Socio,
      TipoMembresia,
    ]),
  ],
  controllers: [JornadasController],
  providers: [JornadasService],
  exports: [JornadasService],
})
export class JornadasModule {}