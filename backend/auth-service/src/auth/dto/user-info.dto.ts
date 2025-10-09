import { Exclude, Expose } from 'class-transformer';
import { UserRole, UserStatus } from '../../users/entities/user.entity';

export class UserInfoDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  role: UserRole;

  @Expose()
  status: UserStatus;

  @Expose()
  phone?: string;

  @Expose()
  avatar?: string;

  @Expose()
  lastLoginAt?: Date;

  @Expose()
  createdAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<UserInfoDto>) {
    Object.assign(this, partial);
  }
}