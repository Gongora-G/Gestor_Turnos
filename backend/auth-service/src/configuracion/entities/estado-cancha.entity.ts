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

@Entity('estado_cancha')
export class EstadoCancha {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', length: 7, default: '#10B981' })
  color: string; // Color hex para badges en UI

  @Column({ type: 'varchar', length: 50, nullable: true })
  icono: string; // Nombre del icono (ej: 'CheckCircle', 'Wrench', 'XCircle')

  @Column({ name: 'permite_reservas', type: 'boolean', default: true })
  permiteReservas: boolean; // Si permite crear turnos cuando está en este estado

  @Column({ name: 'visible_en_turnos', type: 'boolean', default: true })
  visibleEnTurnos: boolean; // Si se muestra en el módulo de turnos

  @Column({ type: 'boolean', default: true })
  activa: boolean;

  @Column({ type: 'int', default: 0 })
  orden: number; // Para ordenar en selectores

  @Column({ name: 'es_predeterminado', type: 'boolean', default: false })
  esPredeterminado: boolean; // Estado por defecto al crear cancha

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
