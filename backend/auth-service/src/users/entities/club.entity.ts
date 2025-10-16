import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

export enum ClubStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('clubs')
export class Club {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ type: 'int' })
  totalCourts: number;

  @Column()
  contactEmail: string;

  @Column()
  contactPhone: string;

  @Column({
    type: 'enum',
    enum: ClubStatus,
    default: ClubStatus.ACTIVE,
  })
  status: ClubStatus;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionExpiresAt?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  monthlyFee: number;

  @OneToMany(() => User, (user) => user.club)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Método helper para verificar si está activo
  get isActive(): boolean {
    return this.status === ClubStatus.ACTIVE;
  }

  // Método helper para verificar suscripción
  get isSubscriptionActive(): boolean {
    if (!this.subscriptionExpiresAt) return true;
    return new Date() <= this.subscriptionExpiresAt;
  }
}