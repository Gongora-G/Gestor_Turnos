import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TipoMembresia } from '../../configuracion/entities/tipo-membresia.entity';

export enum TipoDocumento {
  CEDULA = 'cedula',
  PASAPORTE = 'pasaporte',
  EXTRANJERIA = 'extranjeria'
}

export enum EstadoSocio {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  SUSPENDIDO = 'suspendido'
}

@Entity('socios')
export class Socio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  documento: string;

  @Column({
    type: 'enum',
    enum: TipoDocumento,
    default: TipoDocumento.CEDULA
  })
  tipo_documento: TipoDocumento;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  direccion: string;

  @Column('uuid')
  tipo_membresia_id: string;

  @ManyToOne(() => TipoMembresia, { eager: false })
  @JoinColumn({ name: 'tipo_membresia_id' })
  tipo_membresia: TipoMembresia;

  @Column({ type: 'date' })
  fecha_inicio_membresia: string;

  @Column({ type: 'date', nullable: true })
  fecha_vencimiento: string;

  @Column({
    type: 'enum',
    enum: EstadoSocio,
    default: EstadoSocio.ACTIVO
  })
  estado: EstadoSocio;

  @Column({ type: 'text', nullable: true })
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