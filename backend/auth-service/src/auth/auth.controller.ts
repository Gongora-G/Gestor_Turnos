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
    console.log('📥 Datos recibidos en el backend:', registerDto);
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
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    try {
      if (!code) {
        throw new Error('No authorization code received');
      }

      // Obtener token de acceso de Google
      const tokenResponse = await this.authService.exchangeCodeForToken(code);
      
      // Obtener información del usuario desde Google
      const googleUser = await this.authService.getGoogleUserInfo(tokenResponse.access_token);
      
      console.log('Google user info:', googleUser);

      if (isRegister) {
        // Para registro híbrido: verificar si el usuario ya existe
        const existingUser = await this.authService.findUserByEmail(googleUser.email);
        
        if (existingUser) {
          // Si el usuario ya existe, redirigir al login con mensaje
          return res.redirect(`${frontendUrl}/login?error=user_exists&message=${encodeURIComponent('Esta cuenta ya está registrada. Inicia sesión en su lugar.')}`);
        }
        
        // Redirigir al formulario de registro con datos pre-llenados
        const redirectUrl = `${frontendUrl}/register?` +
          `google_email=${encodeURIComponent(googleUser.email)}&` +
          `google_firstName=${encodeURIComponent(googleUser.given_name || '')}&` +
          `google_lastName=${encodeURIComponent(googleUser.family_name || '')}`;
        
        return res.redirect(redirectUrl);
      } else {
        // Para login: verificar si el usuario existe y autenticarlo
        const existingUser = await this.authService.findUserByEmail(googleUser.email);
        
        if (!existingUser) {
          // Si el usuario no existe, redirigir al registro
          return res.redirect(`${frontendUrl}/register?error=user_not_found&message=${encodeURIComponent('No tienes una cuenta. Regístrate primero.')}`);
        }
        
        // Generar JWT token para el usuario existente
        const authResult = await this.authService.generateTokenForUser(existingUser);
        
        // Redirigir al dashboard con token
        return res.redirect(`${frontendUrl}/dashboard?token=${authResult.access_token}&message=${encodeURIComponent('¡Inicio de sesión exitoso!')}`);
      }
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      
      // Redirigir al frontend con error
      const errorMessage = encodeURIComponent('Error en la autenticación con Google. Intenta de nuevo.');
      
      if (isRegister) {
        return res.redirect(`${frontendUrl}/register?error=oauth_error&message=${errorMessage}`);
      } else {
        return res.redirect(`${frontendUrl}/login?error=oauth_error&message=${errorMessage}`);
      }
    }
  }
}