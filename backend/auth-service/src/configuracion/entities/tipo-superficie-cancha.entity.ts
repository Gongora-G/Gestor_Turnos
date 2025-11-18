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

@Entity('tipo_superficie_cancha')
export class TipoSuperficieCancha {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', length: 7, default: '#3B82F6' })
  color: string; // Color hex para badges en UI

  @Column({ 
    type: 'varchar', 
    length: 20, 
    default: 'media',
    comment: 'Velocidad de la superficie: rapida, media, lenta'
  })
  velocidad: string;

  @Column({ name: 'requiere_mantenimiento_especial', type: 'boolean', default: false })
  requiereMantenimientoEspecial: boolean;

  @Column({ type: 'boolean', default: true })
  activa: boolean;

  @Column({ type: 'int', default: 0 })
  orden: number; // Para ordenar en selectores

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
