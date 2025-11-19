import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'auth', name: 'tareas' })
export class Tarea {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  categoria: string;

  @Column({ type: 'integer', nullable: true, name: 'tiempo_estimado' })
  tiempoEstimado: number; // en minutos

  @Column({ type: 'varchar', length: 20, nullable: true })
  prioridad: string; // alta, media, baja

  @Column({ type: 'boolean', default: true })
  activa: boolean;

  @Column({ type: 'uuid', name: 'club_id' })
  clubId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
