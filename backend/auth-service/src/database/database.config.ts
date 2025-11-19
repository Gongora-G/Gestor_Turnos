import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Club } from '../users/entities/club.entity';
import { TipoMembresia } from '../configuracion/entities/tipo-membresia.entity';
import { Cancha } from '../configuracion/entities/cancha.entity';
import { TipoSuperficieCancha } from '../configuracion/entities/tipo-superficie-cancha.entity';
import { EstadoCancha } from '../configuracion/entities/estado-cancha.entity';
import { ConfiguracionClub } from '../configuracion/entities/configuracion-club.entity';
import { EstadoPersonal } from '../configuracion/entities/estado-personal.entity';
import { Turno } from '../turnos/entities/turno.entity';
import { Caddie } from '../turnos/entities/caddie.entity';
import { Boleador } from '../turnos/entities/boleador.entity';
import { Socio } from '../socios/entities/socio.entity';
import { JornadaConfig, ConfiguracionJornadas, RegistroJornada } from '../jornadas/entities/jornada.entity';
import { TipoPersonal } from '../personal/entities/tipo-personal.entity';
import { Personal } from '../personal/entities/personal.entity';
import { RegistroAsistencia } from '../asistencia/entities/registro-asistencia.entity';
import { Tarea } from '../asistencia/entities/tarea.entity';
import { TareaAsignada } from '../asistencia/entities/tarea-asignada.entity';

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
    TipoSuperficieCancha,
    EstadoCancha,
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
    Personal,
    RegistroAsistencia,
    Tarea,
    TareaAsignada
  ],
  synchronize: true, // Habilitado temporalmente para crear tablas (desarrollo)
  logging: configService.get<string>('NODE_ENV') === 'development',
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  schema: 'auth', // Usar schema auth que creamos en Docker
});