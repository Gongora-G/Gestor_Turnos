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
  ],
  controllers: [JornadasController],
  providers: [JornadasService],
  exports: [JornadasService],
})
export class JornadasModule {}