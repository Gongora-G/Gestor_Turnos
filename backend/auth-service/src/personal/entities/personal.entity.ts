import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TipoPersonal } from './tipo-personal.entity';
import { EstadoPersonal } from '../../configuracion/entities/estado-personal.entity';

@Entity({ schema: 'auth', name: 'personal' })
export class Personal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'integer', name: 'tipo_personal_id' })
  tipoPersonalId: number;

  @ManyToOne(() => TipoPersonal, (tipo) => tipo.personal, { eager: true })
  @JoinColumn({ name: 'tipo_personal_id' })
  tipoPersonal: TipoPersonal;

  @Column({ type: 'jsonb', default: {}, name: 'datos_especificos' })
  datosEspecificos: Record<string, any>;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'tarifa_por_hora' })
  tarifaPorHora: number;

  // DEPRECADO: Mantener para compatibilidad durante la migración
  @Column({ type: 'varchar', length: 20, default: 'disponible', nullable: true })
  estado: string;

  @Column({ type: 'integer', nullable: true, name: 'estado_id' })
  estadoId: number;

  @ManyToOne(() => EstadoPersonal, (estado) => estado.personal, { eager: true })
  @JoinColumn({ name: 'estado_id' })
  estadoObj: EstadoPersonal;

  @Column({ type: 'text', nullable: true, name: 'horarios_disponibles' })
  horariosDisponibles: string;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // 🔄 ASIGNACIÓN A JORNADA (Opcional - algunos tienen horario libre)
  @Column({ type: 'integer', nullable: true, name: 'jornada_asignada_id' })
  jornadaAsignadaId: number;

  @Column({ type: 'uuid', name: 'club_id' })
  clubId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
