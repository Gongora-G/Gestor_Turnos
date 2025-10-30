import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cancha } from '../../configuracion/entities/cancha.entity';
import { Socio } from '../../socios/entities/socio.entity';

export enum EstadoTurno {
  EN_PROGRESO = 'en_progreso',
  COMPLETADO = 'completado'
}

@Entity('turnos')
export class Turno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombre: string;

  @Column({ type: 'integer', default: 1, nullable: true })
  numero_turno_dia: number;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'time' })
  hora_fin: string;

  @Column('uuid')
  cancha_id: string;

  @ManyToOne(() => Cancha, { eager: false })
  @JoinColumn({ name: 'cancha_id' })
  cancha: Cancha;

  @Column('uuid', { nullable: true })
  usuario_id: string;

  @Column('uuid', { nullable: true })
  socio_id: string;

  @ManyToOne(() => Socio, { eager: false })
  @JoinColumn({ name: 'socio_id' })
  socio: Socio;

  @Column({
    type: 'enum',
    enum: EstadoTurno,
    default: EstadoTurno.EN_PROGRESO
  })
  estado: EstadoTurno;

  @Column({ type: 'varchar', length: 500, nullable: true })
  observaciones: string;

  @Column('uuid')
  club_id: string;

  @Column('uuid', { nullable: true })
  jornada_activa_id: string;

  @Column({ type: 'integer', nullable: true, comment: 'ID de la jornada configurada a la que pertenece este turno' })
  jornada_config_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}