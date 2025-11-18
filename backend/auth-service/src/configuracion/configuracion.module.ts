import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoMembresia } from './entities/tipo-membresia.entity';
import { Cancha } from './entities/cancha.entity';
import { ConfiguracionClub } from './entities/configuracion-club.entity';
import { EstadoPersonal } from './entities/estado-personal.entity';
import { TipoSuperficieCancha } from './entities/tipo-superficie-cancha.entity';
import { EstadoCancha } from './entities/estado-cancha.entity';
import { TipoMembresiaService } from './tipo-membresia.service';
import { CanchaService } from './cancha.service';
import { ConfiguracionClubService } from './configuracion-club.service';
import { EstadoPersonalService } from './estado-personal.service';
import { TipoSuperficieCanchaService } from './tipo-superficie-cancha.service';
import { EstadoCanchaService } from './estado-cancha.service';
import { TipoMembresiaController } from './tipo-membresia.controller';
import { CanchaController } from './cancha.controller';
import { ConfiguracionClubController } from './configuracion-club.controller';
import { EstadoPersonalController } from './estado-personal.controller';
import { TipoSuperficieCanchaController } from './tipo-superficie-cancha.controller';
import { EstadoCanchaController } from './estado-cancha.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TipoMembresia, 
      Cancha, 
      ConfiguracionClub, 
      EstadoPersonal,
      TipoSuperficieCancha,
      EstadoCancha,
    ]),
  ],
  controllers: [
    TipoMembresiaController,
    CanchaController,
    ConfiguracionClubController,
    EstadoPersonalController,
    TipoSuperficieCanchaController,
    EstadoCanchaController,
  ],
  providers: [
    TipoMembresiaService,
    CanchaService,
    ConfiguracionClubService,
    EstadoPersonalService,
    TipoSuperficieCanchaService,
    EstadoCanchaService,
  ],
  exports: [
    TipoMembresiaService,
    CanchaService,
    ConfiguracionClubService,
    EstadoPersonalService,
    TipoSuperficieCanchaService,
    EstadoCanchaService,
  ],
})
export class ConfiguracionModule {}