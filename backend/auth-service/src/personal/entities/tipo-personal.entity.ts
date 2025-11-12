import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Personal } from './personal.entity';

export interface CampoPersonalizado {
  nombre: string; // nombre del campo
  tipo: 'text' | 'number' | 'select' | 'checkbox' | 'textarea';
  label: string; // etiqueta para mostrar
  requerido: boolean;
  opciones?: string[]; // para tipo 'select'
  placeholder?: string;
}

@Entity({ schema: 'auth', name: 'tipos_personal' })
export class TipoPersonal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'jsonb', default: [] })
  campos_personalizados: CampoPersonalizado[];

  @Column({ type: 'uuid', name: 'club_id' })
  clubId: string;

  @OneToMany(() => Personal, (personal) => personal.tipoPersonal)
  personal: Personal[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
