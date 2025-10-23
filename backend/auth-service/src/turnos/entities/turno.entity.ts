import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// import { Club } from '../database/entities/club.entity';
// import { User } from '../users/entities/user.entity';
// import { Cancha } from '../configuracion/entities/cancha.entity';

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

  // Relación comentada temporalmente
  // @ManyToOne(() => Club)
  // @JoinColumn({ name: 'club_id' })
  // club: Club;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}