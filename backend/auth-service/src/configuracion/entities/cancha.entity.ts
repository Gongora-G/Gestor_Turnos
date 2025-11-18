import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Club } from '../../users/entities/club.entity';

@Entity('canchas')
export class Cancha {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'int', nullable: true })
  numero: number; // Número de la cancha (1, 2, 3...)

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

  @Column({ name: 'precio_hora', type: 'decimal', precision: 10, scale: 2, nullable: true })
  precioHora: number;

  // Relación con tipo de superficie (sin eager loading para evitar referencias circulares)
  @Column({ name: 'superficie_id', nullable: true })
  superficieId: number;

  // Relación con estado de cancha (sin eager loading)
  @Column({ name: 'estado_id', nullable: true })
  estadoId: number;

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