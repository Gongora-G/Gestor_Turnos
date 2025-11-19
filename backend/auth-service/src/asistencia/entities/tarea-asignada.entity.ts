import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RegistroAsistencia } from './registro-asistencia.entity';
import { Tarea } from './tarea.entity';

@Entity({ schema: 'auth', name: 'tareas_asignadas' })
export class TareaAsignada {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'registro_asistencia_id' })
  registroAsistenciaId: string;

  @ManyToOne(() => RegistroAsistencia)
  @JoinColumn({ name: 'registro_asistencia_id' })
  registroAsistencia: RegistroAsistencia;

  @Column({ type: 'integer', name: 'tarea_id' })
  tareaId: number;

  @ManyToOne(() => Tarea, { eager: true })
  @JoinColumn({ name: 'tarea_id' })
  tarea: Tarea;

  @Column({ type: 'boolean', default: false })
  completada: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'hora_completada' })
  horaCompletada: Date | null;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({ type: 'uuid', name: 'club_id' })
  clubId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
