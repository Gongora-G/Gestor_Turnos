import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST', 'localhost'),
  port: configService.get('DATABASE_PORT', 5432),
  username: configService.get('DATABASE_USERNAME', 'postgres'),
  password: configService.get('DATABASE_PASSWORD', 'postgres123'),
  database: configService.get('DATABASE_NAME', 'gestor_turnos'),
  schema: 'auth',
  entities: [
    'src/**/*.entity.ts'
  ],
  migrations: [
    'src/migrations/*.ts'
  ],
  synchronize: false, // En producción debe ser false
  logging: true,
});

export default AppDataSource;