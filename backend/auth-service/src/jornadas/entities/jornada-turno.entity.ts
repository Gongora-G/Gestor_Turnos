import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'auth', name: 'jornadas_turnos' })
export class JornadaTurno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', name: 'fecha_jornada' })
  fechaJornada: Date;

  @Column({ type: 'varchar', length: 255, name: 'nombre_jornada' })
  nombreJornada: string;

  @Column({ type: 'jsonb', name: 'datos_turnos' })
  datosTurnos: any;

  @Column({ type: 'integer', name: 'total_turnos', default: 0 })
  totalTurnos: number;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @Column({ type: 'boolean', default: true })
  activa: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @Column({ type: 'uuid', name: 'usuario_creacion', nullable: true })
  usuarioCreacion?: string;

  @Column({ type: 'uuid', name: 'usuario_actualizacion', nullable: true })
  usuarioActualizacion?: string;
}