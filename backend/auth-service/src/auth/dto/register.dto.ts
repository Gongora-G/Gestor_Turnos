import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches, IsInt, Min, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @IsEmail({}, { message: 'Por favor proporciona un email válido con un dominio existente (ej: usuario@gmail.com)' })
  @Matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    { message: 'El email debe tener un formato válido con dominio existente' }
  )
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede exceder 50 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { message: 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial' }
  )
  password: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  firstName: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede exceder 50 caracteres' })
  lastName: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, { message: 'Por favor proporciona un número de teléfono válido' })
  phone?: string;

  @IsEnum(UserRole, { message: 'El rol debe ser caddie_master o profesor' })
  role: UserRole;

  // Datos del Club
  @IsString({ message: 'El nombre del club debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre del club debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre del club no puede exceder 100 caracteres' })
  clubName: string;

  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MinLength(10, { message: 'La dirección debe tener al menos 10 caracteres' })
  @MaxLength(200, { message: 'La dirección no puede exceder 200 caracteres' })
  clubAddress: string;

  @IsString({ message: 'La ciudad debe ser una cadena de texto' })
  @MinLength(2, { message: 'La ciudad debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'La ciudad no puede exceder 50 caracteres' })
  clubCity: string;

  @IsString({ message: 'El país debe ser una cadena de texto' })
  @MinLength(2, { message: 'El país debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El país no puede exceder 50 caracteres' })
  clubCountry: string;

  @IsInt({ message: 'El número de canchas debe ser un entero' })
  @Min(1, { message: 'El club debe tener al menos 1 cancha' })
  @Transform(({ value }) => parseInt(value))
  totalCourts: number;

  @IsEmail({}, { message: 'Por favor proporciona un email de contacto válido para el club' })
  clubContactEmail: string;

  @IsString({ message: 'El teléfono de contacto debe ser una cadena de texto' })
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, { message: 'Por favor proporciona un número de teléfono válido para el club' })
  clubContactPhone: string;
}