import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Personal } from '../../personal/entities/personal.entity';
import { JornadaConfig } from '../../jornadas/entities/jornada.entity';

@Entity({ schema: 'auth', name: 'registro_asistencia' })
export class RegistroAsistencia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'personal_id' })
  personalId: string;

  @ManyToOne(() => Personal, { eager: true })
  @JoinColumn({ name: 'personal_id' })
  personal: Personal;

  @Column({ type: 'integer', name: 'jornada_config_id' })
  jornadaConfigId: number;

  @ManyToOne(() => JornadaConfig, { eager: true })
  @JoinColumn({ name: 'jornada_config_id' })
  jornadaConfig: JornadaConfig;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'timestamp', name: 'hora_llegada' })
  horaLlegada: Date;

  @Column({ type: 'boolean', default: false, name: 'tareas_completadas' })
  tareasCompletadas: boolean;

  @Column({ type: 'text', nullable: true, name: 'tareas_pendientes' })
  tareasPendientes: string;

  @Column({ type: 'integer', default: 0, name: 'turnos_realizados_ayer' })
  turnosRealizadosAyer: number;

  @Column({ type: 'integer', nullable: true, name: 'orden_calculado' })
  ordenCalculado: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'boolean', default: true })
  presente: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'hora_salida' })
  horaSalida: Date;

  @Column({ type: 'uuid', name: 'registrado_por' })
  registradoPor: string;

  @Column({ type: 'uuid', name: 'club_id' })
  clubId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
