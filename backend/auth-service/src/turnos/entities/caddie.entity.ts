import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Club } from '../../users/entities/club.entity';
import { Turno } from './turno.entity';

@Entity('caddies')
export class Caddie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  especialidades: string; // JSON con especialidades: ['tenis', 'paddle', etc.]

  @Column({ type: 'int', default: 1 })
  nivel_experiencia: number; // 1-5, donde 5 es más experimentado

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  tarifa_por_hora: number;

  @Column({ type: 'varchar', length: 50, default: 'disponible' })
  estado: string; // 'disponible', 'ocupado', 'descanso', 'inactivo'

  @Column({ type: 'text', nullable: true })
  horarios_disponibles: string; // JSON con horarios disponibles por día

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // Relación con el club
  @ManyToOne(() => Club, { nullable: false })
  @JoinColumn({ name: 'club_id' })
  club: Club;

  @Column({ name: 'club_id' })
  clubId: string;

  // Relación con turnos como caddie
  @OneToMany(() => Turno, turno => turno.caddie)
  turnos_como_caddie: Turno[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}