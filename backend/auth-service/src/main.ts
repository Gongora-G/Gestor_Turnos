import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 📦 IMPORTANT: Configure JSON body parser BEFORE other middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // 🍪 Configure cookie parser
  app.use(cookieParser());
  
  // 🔍 DEBUG: Log todas las peticiones (DESPUÉS del body parser de NestJS)
  app.use((req, res, next) => {
    if (req.method === 'POST' && req.url.includes('/asistencia/registrar')) {
      console.log('🔥🔥🔥 PETICIÓN RECIBIDA /asistencia/registrar');
      console.log('Body:', JSON.stringify(req.body, null, 2));
      console.log('Headers Authorization:', req.headers.authorization ? 'PRESENTE' : 'AUSENTE');
    }
    next();
  });
  
  // 🔧 Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false, // Temporalmente deshabilitado para debug
    transform: true,
    transformOptions: {
      enableImplicitConversion: true, // Conversión automática de tipos
    },
  }));

  // 🚀 CORS configuration for frontend integration
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4200', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true,
  });

  const port = process.env.PORT ?? 3002;
  await app.listen(port, '0.0.0.0');
  
  console.log('🚀 Auth Service running on: http://localhost:' + port);
  console.log('📋 Available endpoints:');
  console.log('  POST /auth/register - User registration');
  console.log('  POST /auth/login    - User login');
  console.log('  GET  /auth/profile  - Get user profile (requires JWT)');
  console.log('  GET  /auth/validate - Validate JWT token');
  console.log('  GET  /api/users     - Get all users');
  console.log('  POST /api/users     - Create new user');
  console.log('  GET  /api/canchas   - Get all canchas');
  console.log('  POST /api/canchas   - Create new cancha');
  console.log('  GET  /api/turnos    - Get all turnos');
  console.log('  POST /api/turnos    - Create new turno');
  console.log('✅ Service ready for connections!');
}
bootstrap();


