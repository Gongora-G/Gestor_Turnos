import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoMembresia } from './entities/tipo-membresia.entity';
import { Cancha } from './entities/cancha.entity';
import { ConfiguracionClub } from './entities/configuracion-club.entity';
import { EstadoPersonal } from './entities/estado-personal.entity';
import { TipoMembresiaService } from './tipo-membresia.service';
import { CanchaService } from './cancha.service';
import { ConfiguracionClubService } from './configuracion-club.service';
import { EstadoPersonalService } from './estado-personal.service';
import { TipoMembresiaController } from './tipo-membresia.controller';
import { CanchaController } from './cancha.controller';
import { ConfiguracionClubController } from './configuracion-club.controller';
import { EstadoPersonalController } from './estado-personal.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoMembresia, Cancha, ConfiguracionClub, EstadoPersonal]),
  ],
  controllers: [
    TipoMembresiaController,
    CanchaController,
    ConfiguracionClubController,
    EstadoPersonalController,
  ],
  providers: [
    TipoMembresiaService,
    CanchaService,
    ConfiguracionClubService,
    EstadoPersonalService,
  ],
  exports: [
    TipoMembresiaService,
    CanchaService,
    ConfiguracionClubService,
    EstadoPersonalService,
  ],
})
export class ConfiguracionModule {}