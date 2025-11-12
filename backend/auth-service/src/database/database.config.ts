import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Club } from '../users/entities/club.entity';
import { TipoMembresia } from '../configuracion/entities/tipo-membresia.entity';
import { Cancha } from '../configuracion/entities/cancha.entity';
import { ConfiguracionClub } from '../configuracion/entities/configuracion-club.entity';
import { EstadoPersonal } from '../configuracion/entities/estado-personal.entity';
import { Turno } from '../turnos/entities/turno.entity';
import { Caddie } from '../turnos/entities/caddie.entity';
import { Boleador } from '../turnos/entities/boleador.entity';
import { Socio } from '../socios/entities/socio.entity';
import { JornadaConfig, ConfiguracionJornadas, RegistroJornada } from '../jornadas/entities/jornada.entity';
import { TipoPersonal } from '../personal/entities/tipo-personal.entity';
import { Personal } from '../personal/entities/personal.entity';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [
    User, 
    Club, 
    TipoMembresia, 
    Cancha, 
    ConfiguracionClub,
    EstadoPersonal,
    Turno,
    Caddie,
    Boleador,
    Socio,
    JornadaConfig,
    ConfiguracionJornadas,
    RegistroJornada,
    TipoPersonal,
    Personal
  ],
  synchronize: true, // Habilitado temporalmente para crear tablas tipos_personal y personal
  logging: configService.get<string>('NODE_ENV') === 'development',
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  schema: 'auth', // Usar schema auth que creamos en Docker
});