import { 
  Controller, 
  Post, 
  Get,
  Body, 
  UseGuards, 
  ValidationPipe,
  HttpCode,
  HttpStatus,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  Res
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponseDto, UserInfoDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators';
import { User } from '../users/entities/user.entity';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto
  ): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: LoginDto
  ): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@GetUser() user: User): Promise<UserInfoDto> {
    return new UserInfoDto(user);
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async validateToken(@GetUser() user: User): Promise<{ valid: boolean; user: UserInfoDto }> {
    return {
      valid: true,
      user: new UserInfoDto(user)
    };
  }

  // Google OAuth endpoints - Simple approach
  @Get('google')
  async googleAuth(@Res() res: Response, @Query('context') context?: string) {
    const isRegister = context === 'register';
    console.log('Google OAuth initiated - Context:', context, 'Is Register:', isRegister);
    
    // Construir URL de Google OAuth
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = encodeURIComponent('http://localhost:3002/auth/google/callback');
    const scope = encodeURIComponent('email profile');
    const state = encodeURIComponent(context || 'login');
    
    let googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scope}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `state=${state}`;
    
    // Si es registro, forzar selección de cuenta
    if (isRegister) {
      googleAuthUrl += `&prompt=select_account`;
      console.log('REGISTER: Forcing account selection');
    }
    
    return res.redirect(googleAuthUrl);
  }

  @Get('google/callback')
  async googleCallback(@Res() res: Response, @Query('state') state?: string, @Query('code') code?: string) {
    console.log('Google OAuth Callback - State:', state, 'Code:', code ? 'present' : 'missing');
    
    const context = state || 'login';
    const isRegister = context === 'register';
    
    console.log('Final context:', context, 'Is Register:', isRegister);
    
    // Aquí implementarías la lógica de OAuth
    // Redirigir según el contexto
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    if (isRegister) {
      // Para registro: ir al dashboard con mensaje de éxito
      return res.redirect(`${frontendUrl}/dashboard?oauth_result=register&success=true&message=¡Registro exitoso! Bienvenido`);
    } else {
      // Para login: ir al dashboard con mensaje de bienvenida
      return res.redirect(`${frontendUrl}/dashboard?oauth_result=login&success=true&message=¡Inicio de sesión exitoso!`);
    }
  }
}