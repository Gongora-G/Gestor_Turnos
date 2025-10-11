import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User, UserStatus } from '../users/entities/user.entity';
import { RegisterDto, LoginDto, AuthResponseDto, UserInfoDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, phone } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Este correo electrónico ya está registrado con otra cuenta. Por favor, usa un email diferente o inicia sesión.');
    }

    // Hashear la contraseña
    const hashedPassword = await this.hashPassword(password);

    // Crear nuevo usuario
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      status: UserStatus.ACTIVE,
    });

    // Guardar usuario
    const savedUser = await this.userRepository.save(user);

    // Generar token JWT
    const payload = { 
      sub: savedUser.id, 
      email: savedUser.email, 
      role: savedUser.role 
    };
    
    const access_token = this.jwtService.sign(payload);

    // Actualizar lastLoginAt
    await this.userRepository.update(savedUser.id, { 
      lastLoginAt: new Date() 
    });

    return {
      access_token,
      user: new UserInfoDto(savedUser),
      expires_in: 3600, // 1 hora
      token_type: 'Bearer',
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Buscar usuario por email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await this.validatePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar estado del usuario
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Usuario inactivo o suspendido');
    }

    // Generar token JWT
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    const access_token = this.jwtService.sign(payload);

    // Actualizar lastLoginAt
    await this.userRepository.update(user.id, { 
      lastLoginAt: new Date() 
    });

    return {
      access_token,
      user: new UserInfoDto(user),
      expires_in: 3600, // 1 hora
      token_type: 'Bearer',
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Usuario inactivo o suspendido');
    }

    return user;
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    return user;
  }

  async validateGoogleUser(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
  }): Promise<{ user: User; isNewUser: boolean }> {
    const { email, firstName, lastName, picture } = googleUser;
    console.log('🔍 AuthService.validateGoogleUser - Input:', { email, firstName, lastName });

    // Verificar si el usuario ya existe
    let user = await this.userRepository.findOne({
      where: { email },
    });
    console.log('🔍 AuthService.validateGoogleUser - Existing user:', user ? `Found: ${user.email}` : 'Not found');

    let isNewUser = false;

    if (!user) {
      // Crear nuevo usuario con Google OAuth
      user = this.userRepository.create({
        email,
        firstName,
        lastName,
        // Para usuarios OAuth, generar una contraseña aleatoria (no se usará)
        password: await this.hashPassword(Math.random().toString(36).substring(2, 15)),
        status: UserStatus.ACTIVE,
        lastLoginAt: new Date(),
      });

      user = await this.userRepository.save(user);
      isNewUser = true;
      console.log('🔍 AuthService.validateGoogleUser - Created new user:', user.email);
    } else {
      // Actualizar lastLoginAt para usuario existente
      await this.userRepository.update(user.id, { 
        lastLoginAt: new Date() 
      });
      console.log('🔍 AuthService.validateGoogleUser - Updated existing user:', user.email);
    }

    console.log('🔍 AuthService.validateGoogleUser - Returning user:', { id: user.id, email: user.email, isNewUser });
    return { user, isNewUser };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async generateJwtToken(user: User): Promise<AuthResponseDto> {
    // Generar token JWT
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    const access_token = this.jwtService.sign(payload);

    // Actualizar lastLoginAt solo si tenemos un ID válido
    if (user.id) {
      await this.userRepository.update({ id: user.id }, { 
        lastLoginAt: new Date() 
      });
    }

    return {
      access_token,
      user: new UserInfoDto(user),
      expires_in: 3600, // 1 hora
      token_type: 'Bearer',
    };
  }
}