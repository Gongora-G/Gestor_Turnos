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

@Entity('canchas')
export class Cancha {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  ubicacion: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  descripcion: string;

  @Column({ type: 'int', default: 4 })
  capacidad: number;

  @Column({ type: 'boolean', default: true })
  activa: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo: string; // 'tenis', 'paddle', 'futbol', etc.

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio_hora: number;

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