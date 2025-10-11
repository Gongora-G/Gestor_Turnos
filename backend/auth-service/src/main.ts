import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 🍪 Configure cookie parser
  app.use(cookieParser());
  
  // 🔧 Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // 🚀 CORS configuration for frontend integration
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4200', 'http://localhost:5173'],
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log('🚀 Auth Service running on: http://localhost:' + port);
  console.log('📋 Available endpoints:');
  console.log('  POST /auth/register - User registration');
  console.log('  POST /auth/login    - User login');
  console.log('  GET  /auth/profile  - Get user profile (requires JWT)');
  console.log('  GET  /auth/validate - Validate JWT token');
  console.log('✅ Service ready for connections!');
}
bootstrap();
