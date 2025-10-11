import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, StrategyOptions } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class GoogleRegisterStrategy extends PassportStrategy(Strategy, 'google-register') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_REGISTER_CALLBACK_URL'),
      scope: ['email', 'profile'],
      prompt: 'select_account', // Fuerza mostrar selector de cuenta
      accessType: 'offline',
      approvalPrompt: 'force'
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };

    try {
      console.log('🔍 GoogleRegisterStrategy - Received profile:', { email: user.email, name: user.firstName + ' ' + user.lastName });
      // Buscar o crear usuario con Google OAuth
      const result = await this.authService.validateGoogleUser(user);
      const dbUser = result.user;
      console.log('🔍 GoogleRegisterStrategy - DB User found/created:', dbUser ? `${dbUser.email} (${dbUser.id})` : 'null', 'isNewUser:', result.isNewUser);
      
      // Añadir la información de si es nuevo usuario al objeto user para pasarlo al callback
      (dbUser as any).isNewUser = result.isNewUser;
      
      done(null, dbUser);
    } catch (error) {
      console.error('❌ GoogleRegisterStrategy - Error:', error);
      done(error, false);
    }
  }
}