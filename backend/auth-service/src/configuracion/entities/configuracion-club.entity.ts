import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Club } from '../../users/entities/club.entity';

@Entity('configuracion_club')
export class ConfiguracionClub {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Información básica
  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  direccion: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  sitio_web: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo_url: string;

  // Configuraciones de horarios
  @Column({ type: 'time', default: '06:00:00' })
  hora_apertura: string;

  @Column({ type: 'time', default: '22:00:00' })
  hora_cierre: string;

  @Column({ type: 'int', default: 60 })
  duracion_turno_minutos: number;

  // Configuraciones de reservas
  @Column({ type: 'boolean', default: true })
  reservas_automaticas: boolean;

  @Column({ type: 'int', default: 3 })
  limite_reservas_usuario: number;

  @Column({ type: 'int', default: 7 })
  anticipacion_maxima_dias: number;

  // Configuraciones de notificaciones
  @Column({ type: 'boolean', default: true })
  notificaciones_email: boolean;

  @Column({ type: 'boolean', default: true })
  recordatorios_activos: boolean;

  // Configuraciones del sistema
  @Column({ type: 'boolean', default: true })
  backup_automatico: boolean;

  @Column({ type: 'boolean', default: false })
  modo_mantenimiento: boolean;

  @ManyToOne(() => Club, { nullable: false })
  @JoinColumn({ name: 'club_id' })
  club: Club;

  @Column({ name: 'club_id' })
  clubId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}