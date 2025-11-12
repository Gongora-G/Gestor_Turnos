import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Club } from '../../users/entities/club.entity';
import { Personal } from '../../personal/entities/personal.entity';

@Entity('estados_personal')
export class EstadoPersonal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clubId: number;

  @ManyToOne(() => Club)
  @JoinColumn({ name: 'clubId' })
  club: Club;

  @Column({ length: 50 })
  nombre: string;

  @Column({ length: 7, default: '#6B7280' })
  color: string; // Formato hexadecimal para el color del badge

  @Column({ default: true })
  activo: boolean;

  @Column({ default: false })
  esOcupado: boolean; // Indica si este estado significa que el personal está ocupado en un turno

  @Column({ default: false })
  esSistema: boolean; // Estados del sistema no se pueden eliminar (disponible, ocupado)

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @OneToMany(() => Personal, (personal) => personal.estadoObj)
  personal: Personal[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
