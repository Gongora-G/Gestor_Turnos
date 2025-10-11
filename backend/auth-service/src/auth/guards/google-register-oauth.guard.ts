import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleRegisterOAuthGuard extends AuthGuard('google-register') {}