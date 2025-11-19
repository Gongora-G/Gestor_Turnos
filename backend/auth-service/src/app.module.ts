import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './database/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { TurnosModule } from './turnos/turnos.module';
import { SociosModule } from './socios/socios.module';
import { JornadasModule } from './jornadas/jornadas.module';
import { PersonalModule } from './personal/personal.module';
import { AsistenciaModule } from './asistencia/asistencia.module';

@Module({
  imports: [
    // 🔧 Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // 🗄️ Database connection
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        databaseConfig(configService),
      inject: [ConfigService],
    }),
    // 👥 Users module
    UsersModule,
    // 🔐 Authentication module
    AuthModule,
    // ⚙️ Configuration module
    ConfiguracionModule,
    // 📅 Turnos module
    TurnosModule,
    // 👤 Socios module
    SociosModule,
    // 🕐 Jornadas module
    JornadasModule,
    // 👨‍💼 Personal module (Caddies y Boleadores)
    PersonalModule,
    // ✅ Asistencia module (Registro de llegadas)
    AsistenciaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
