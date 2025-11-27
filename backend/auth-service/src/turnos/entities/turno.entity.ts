import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
// import { Club } from '../database/entities/club.entity';
// import { User } from '../users/entities/user.entity';
// import { Cancha } from '../configuracion/entities/cancha.entity';
import { Caddie } from './caddie.entity';
import { Boleador } from './boleador.entity';

export enum EstadoTurno {
  EN_PROGRESO = 'en_progreso',
  COMPLETADO = 'completado'
}

export enum EstadoRegistro {
  ACTIVO = 'ACTIVO',
  GUARDADO = 'GUARDADO'
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

  // Relación comentada temporalmente
  // @ManyToOne(() => Cancha)
  // @JoinColumn({ name: 'cancha_id' })
  // cancha: Cancha;

  @Column('uuid', { nullable: true })
  usuario_id: string;

  // Relación comentada temporalmente
  // @ManyToOne(() => User, { nullable: true })
  // @JoinColumn({ name: 'usuario_id' })
  // usuario: User;

  @Column('uuid', { nullable: true })
  socio_id: string;

  // Relaciones con Caddie y Boleador
  @Column('uuid', { nullable: true })
  caddie_id: string;

  @ManyToOne(() => Caddie, caddie => caddie.turnos_como_caddie, { nullable: true })
  @JoinColumn({ name: 'caddie_id' })
  caddie: Caddie;

  @Column('uuid', { nullable: true })
  boleador_id: string;

  @ManyToOne(() => Boleador, boleador => boleador.turnos_como_boleador, { nullable: true })
  @JoinColumn({ name: 'boleador_id' })
  boleador: Boleador;

  // Array de IDs de personal asignado al turno (nuevo sistema unificado)
  @Column({
    type: 'jsonb',
    nullable: true,
    default: '[]',
    comment: 'Array de IDs de personal asignado al turno del sistema unificado'
  })
  personal_asignado: string[];

  @Column({
    type: 'enum',
    enum: EstadoTurno,
    default: EstadoTurno.EN_PROGRESO
  })
  estado: EstadoTurno;

  @Column({
    type: 'enum',
    enum: EstadoRegistro,
    default: EstadoRegistro.ACTIVO,
    comment: 'Estado del registro: activo (no guardado) o guardado (ya registrado en jornada)'
  })
  estado_registro: EstadoRegistro;

  @Column({ type: 'varchar', length: 500, nullable: true })
  observaciones: string;

  @Column('uuid')
  club_id: string;

  // Relación comentada temporalmente
  // @ManyToOne(() => Club)
  // @JoinColumn({ name: 'club_id' })
  // club: Club;

  @Column('uuid', { nullable: true })
  jornada_activa_id: string;

  @Column({ type: 'integer', nullable: true, comment: 'ID de la jornada configurada a la que pertenece este turno' })
  jornada_config_id: number;

  // TODO: Agregar jornada_id cuando se cree la migración de BD
  // @Column({ type: 'integer', nullable: true, comment: 'ID de la jornada activa actual' })
  // jornada_id: number;

  // Soft delete para papelera
  @Column({ type: 'boolean', default: false, comment: 'Indica si el turno está en la papelera' })
  eliminado: boolean;

  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha en que se movió a la papelera' })
  fechaEliminacion: Date | null;

  @Column({ type: 'uuid', nullable: true, comment: 'ID del usuario que eliminó el turno' })
  eliminadoPor: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}