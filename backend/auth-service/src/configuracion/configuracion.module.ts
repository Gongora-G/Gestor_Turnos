import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoMembresia } from './entities/tipo-membresia.entity';
import { Cancha } from './entities/cancha.entity';
import { ConfiguracionClub } from './entities/configuracion-club.entity';
import { TipoMembresiaService } from './tipo-membresia.service';
import { CanchaService } from './cancha.service';
import { ConfiguracionClubService } from './configuracion-club.service';
import { TipoMembresiaController } from './tipo-membresia.controller';
import { CanchaController } from './cancha.controller';
import { ConfiguracionClubController } from './configuracion-club.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoMembresia, Cancha, ConfiguracionClub]),
  ],
  controllers: [
    TipoMembresiaController,
    CanchaController,
    ConfiguracionClubController,
  ],
  providers: [
    TipoMembresiaService,
    CanchaService,
    ConfiguracionClubService,
  ],
  exports: [
    TipoMembresiaService,
    CanchaService,
    ConfiguracionClubService,
  ],
})
export class ConfiguracionModule {}