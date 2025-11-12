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

@Entity('boleadores')
export class Boleador {
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

  @Column({ type: 'varchar', length: 50, default: 'intermedio' })
  nivel_juego: string; // 'principiante', 'intermedio', 'avanzado', 'profesional'

  @Column({ type: 'text', nullable: true })
  deportes: string; // JSON con deportes que practica: ['tenis', 'paddle', etc.]

  @Column({ type: 'int', default: 3 })
  ranking_habilidad: number; // 1-10, nivel de habilidad del boleador

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  tarifa_por_hora: number;

  @Column({ type: 'varchar', length: 50, default: 'disponible' })
  estado: string; // 'disponible', 'ocupado', 'descanso', 'inactivo'

  @Column({ type: 'text', nullable: true })
  horarios_disponibles: string; // JSON con horarios disponibles por día

  @Column({ type: 'text', nullable: true })
  preferencias: string; // JSON con preferencias: tipo de juego, duración, etc.

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

  // Relación con turnos como boleador
  @OneToMany(() => Turno, turno => turno.boleador)
  turnos_como_boleador: Turno[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}