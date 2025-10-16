import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Club } from './club.entity';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  CADDIE_MASTER = 'caddie_master',
  PROFESOR = 'profesor',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() // No incluir password en respuestas JSON
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CADDIE_MASTER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  clubId?: string;

  @ManyToOne(() => Club, (club) => club.users)
  @JoinColumn({ name: 'clubId' })
  club?: Club;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Método helper para obtener nombre completo
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Método helper para verificar si es super admin
  get isSuperAdmin(): boolean {
    return this.role === UserRole.SUPER_ADMIN;
  }

  // Método helper para verificar si es caddie master
  get isCaddieMaster(): boolean {
    return this.role === UserRole.CADDIE_MASTER;
  }

  // Método helper para verificar si es profesor
  get isProfesor(): boolean {
    return this.role === UserRole.PROFESOR;
  }

  // Método helper para verificar si está activo
  get isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }
}