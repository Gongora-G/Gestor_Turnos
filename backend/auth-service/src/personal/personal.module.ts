import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Importaciones antiguas (mantener por compatibilidad temporal)
import { CaddiesController } from './caddies.controller';
import { CaddiesService } from './caddies.service';
import { BoleadoresController } from './boleadores.controller';
import { BoleadoresService } from './boleadores.service';
import { Caddie } from '../turnos/entities/caddie.entity';
import { Boleador } from '../turnos/entities/boleador.entity';
import { Turno } from '../turnos/entities/turno.entity';
// Nuevas importaciones para sistema unificado
import { TipoPersonal } from './entities/tipo-personal.entity';
import { Personal } from './entities/personal.entity';
import { EstadoPersonal } from '../configuracion/entities/estado-personal.entity';
import { TiposPersonalService } from './tipos-personal.service';
import { TiposPersonalController } from './tipos-personal.controller';
import { PersonalService } from './personal.service';
import { PersonalController } from './personal.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Entidades antiguas
      Caddie, 
      Boleador, 
      Turno,
      // Nuevas entidades unificadas
      TipoPersonal,
      Personal,
      EstadoPersonal,
    ])
  ],
  controllers: [
    // Controllers antiguos (mantener temporalmente)
    CaddiesController, 
    BoleadoresController,
    // Nuevos controllers
    TiposPersonalController,
    PersonalController,
  ],
  providers: [
    // Services antiguos (mantener temporalmente)
    CaddiesService, 
    BoleadoresService,
    // Nuevos services
    TiposPersonalService,
    PersonalService,
  ],
  exports: [
    CaddiesService, 
    BoleadoresService,
    TiposPersonalService,
    PersonalService,
  ],
})
export class PersonalModule {}