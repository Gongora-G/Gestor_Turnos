import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

// ==========================================
// TIPOS Y ENUMS
// ==========================================
export type DiaSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
export type EstadoJornada = 'activa' | 'completada' | 'cancelada';

// ==========================================
// CONFIGURACION_JORNADAS (Esquema general)
// ==========================================
@Entity('configuracion_jornadas', { schema: 'auth' })
export class ConfiguracionJornadas {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'esquema_tipo', length: 20, default: 'personalizado' })
  esquemaTipo: string;

  @Column({ type: 'boolean', default: false })
  activa: boolean;

  @Column({ name: 'club_id', type: 'uuid', nullable: true })
  clubId: string;

  @Column({ name: 'jornada_actual_id', type: 'uuid', nullable: true })
  jornadaActualId: string;

  @Column({ name: 'rotacion_automatica', type: 'boolean', default: true, nullable: true })
  rotacionAutomatica: boolean;

  @Column({ name: 'configurado_por', type: 'uuid', nullable: true })
  configuradoPor: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'fecha_configuracion', type: 'timestamp', default: () => 'NOW()', nullable: true })
  fechaConfiguracion: Date;

  @Column({ name: 'fecha_actualizacion', type: 'timestamp', default: () => 'NOW()', nullable: true })
  fechaActualizacion: Date;
}

// ==========================================
// JORNADAS_CONFIG (Configuración de cada jornada)
// ==========================================
@Entity('jornadas_config', { schema: 'auth' })
export class JornadaConfig {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'configuracion_id', type: 'integer' })
  configuracionId: number;

  @Column({ name: 'codigo', length: 5 })
  codigo: string;

  @Column({ length: 50 })
  nombre: string;

  @Column({ name: 'hora_inicio', type: 'time' })
  horaInicio: string;

  @Column({ name: 'hora_fin', type: 'time' })
  horaFin: string;

  @Column({ length: 7, default: '#3b82f6' })
  color: string;

  @Column({ type: 'integer', default: 1 })
  orden: number;

  @Column({ type: 'boolean', default: true })
  activa: boolean;

  @Column({ name: 'club_id', type: 'uuid', nullable: true })
  clubId: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'configurado_por', type: 'uuid', nullable: true })
  configuradoPor: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => ConfiguracionJornadas)
  @JoinColumn({ name: 'configuracion_id' })
  configuracion: ConfiguracionJornadas;
}

// ==========================================
// REGISTRO_JORNADAS_DIARIAS (Registro diario)
// ==========================================
@Entity('registro_jornadas_diarias', { schema: 'auth' })
export class RegistroJornadaDiaria {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'date', unique: true })
  fecha: Date;

  @Column({ name: 'configuracion_id', type: 'integer', nullable: true })
  configuracionId: number;

  @Column({ length: 20, default: 'activa' })
  estado: string;

  @Column({ name: 'total_turnos', type: 'integer', default: 0 })
  totalTurnos: number;

  @Column({ name: 'total_completados', type: 'integer', default: 0 })
  totalCompletados: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => ConfiguracionJornadas)
  @JoinColumn({ name: 'configuracion_id' })
  configuracion: ConfiguracionJornadas;
}

// ==========================================
// REGISTRO_JORNADAS_DETALLE (Detalle por jornada)
// ==========================================
@Entity('registro_jornadas_detalle', { schema: 'auth' })
export class RegistroJornadaDetalle {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'registro_diario_id', type: 'integer' })
  registroDiarioId: number;

  @Column({ name: 'jornada_config_id', type: 'integer', nullable: true })
  jornadaConfigId: number;

  @Column({ name: 'total_turnos', type: 'integer', default: 0 })
  totalTurnos: number;

  @Column({ name: 'turnos_completados', type: 'integer', default: 0 })
  turnosCompletados: number;

  @Column({ name: 'turnos_en_progreso', type: 'integer', default: 0 })
  turnosEnProgreso: number;

  @Column({ name: 'duracion_total', type: 'decimal', precision: 5, scale: 2, default: 0 })
  duracionTotal: number;

  @Column({ name: 'canchas_mas_usadas', type: 'simple-array', nullable: true })
  canchasMasUsadas: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => RegistroJornadaDiaria)
  @JoinColumn({ name: 'registro_diario_id' })
  registroDiario: RegistroJornadaDiaria;

  @ManyToOne(() => JornadaConfig)
  @JoinColumn({ name: 'jornada_config_id' })
  jornadaConfig: JornadaConfig;
}

// ==========================================
// REGISTROS_JORNADAS (Registros individuales)
// ==========================================
@Entity('registros_jornadas', { schema: 'auth' })
export class RegistroJornada {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'club_id', type: 'uuid' })
  clubId: string;

  @Column({ name: 'jornada_config_id', type: 'integer' })
  jornadaConfigId: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ name: 'hora_inicio', length: 8 })
  horaInicio: string;

  @Column({ name: 'hora_fin', length: 8, nullable: true })
  horaFin: string;

  @Column({ name: 'turnos_registrados', type: 'jsonb', default: '[]' })
  turnosRegistrados: any[];

  @Column({ type: 'jsonb', default: '{}' })
  estadisticas: any;

  @Column({ length: 20, default: 'activa' })
  estado: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ name: 'creado_por', type: 'uuid' })
  creadoPor: string;

  @Column({ name: 'fecha_creacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  fechaCreacion: Date;

  @Column({ name: 'fecha_cierre', type: 'timestamp', nullable: true })
  fechaCierre: Date;
}

// ==========================================
// JORNADAS_ACTIVAS (Jornadas activas actuales)
// ==========================================
@Entity('jornadas_activas', { schema: 'auth' })
export class JornadaActiva {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'fecha_cierre', type: 'date', nullable: true })
  fechaCierre: Date;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'club_id', type: 'uuid' })
  clubId: string;

  @Column({ name: 'usuario_creacion_id', type: 'uuid' })
  usuarioCreacionId: string;

  @Column({ name: 'usuario_cierre_id', type: 'uuid', nullable: true })
  usuarioCierreId: string;

  @Column({ name: 'total_turnos', type: 'integer', default: 0 })
  totalTurnos: number;

  @Column({ type: 'varchar', default: 'activa' })
  estado: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
