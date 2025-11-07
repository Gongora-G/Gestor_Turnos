import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JornadasController } from './jornadas.controller';
import { JornadasService } from './jornadas.service';
import { TurnosModule } from '../turnos/turnos.module';
import { 
  JornadaConfig, 
  ConfiguracionJornadas, 
  RegistroJornada,
  RegistroJornadaDiaria,
  RegistroJornadaDetalle,
  JornadaActiva
} from './entities/jornada.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConfiguracionJornadas,
      JornadaConfig,
      RegistroJornada,
      RegistroJornadaDiaria,
      RegistroJornadaDetalle,
      JornadaActiva,
    ]),
    forwardRef(() => TurnosModule),
  ],
  controllers: [JornadasController],
  providers: [JornadasService],
  exports: [JornadasService],
})
export class JornadasModule {}