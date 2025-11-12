import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caddie } from '../turnos/entities/caddie.entity';
import { CreateCaddieDto } from './dto/create-caddie.dto';
import { UpdateCaddieDto } from './dto/update-caddie.dto';

@Injectable()
export class CaddiesService {
  constructor(
    @InjectRepository(Caddie)
    private caddieRepository: Repository<Caddie>,
  ) {}

  async create(createCaddieDto: CreateCaddieDto): Promise<Caddie> {
    const caddie = this.caddieRepository.create(createCaddieDto);
    return await this.caddieRepository.save(caddie);
  }

  async findAll(clubId?: string): Promise<Caddie[]> {
    const whereCondition = clubId ? { clubId, activo: true } : { activo: true };
    return await this.caddieRepository.find({
      where: whereCondition,
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Caddie> {
    const caddie = await this.caddieRepository.findOne({
      where: { id },
      relations: ['turnos_como_caddie'],
    });
    
    if (!caddie) {
      throw new NotFoundException(`Caddie con ID ${id} no encontrado`);
    }
    
    return caddie;
  }

  async update(id: string, updateCaddieDto: UpdateCaddieDto): Promise<Caddie> {
    const caddie = await this.findOne(id);
    Object.assign(caddie, updateCaddieDto);
    return await this.caddieRepository.save(caddie);
  }

  async remove(id: string): Promise<void> {
    const caddie = await this.findOne(id);
    caddie.activo = false;
    await this.caddieRepository.save(caddie);
  }

  async findAvailableByDateTime(clubId: string, fecha: string, horaInicio: string, horaFin: string): Promise<Caddie[]> {
    // Consulta para encontrar caddies disponibles en el horario específico
    return await this.caddieRepository
      .createQueryBuilder('caddie')
      .leftJoin('caddie.turnos_como_caddie', 'turno', 
        'turno.fecha = :fecha AND turno.estado = :estado AND ' +
        '((turno.hora_inicio < :horaFin AND turno.hora_fin > :horaInicio))'
      )
      .where('caddie.clubId = :clubId', { clubId })
      .andWhere('caddie.activo = true')
      .andWhere('caddie.estado = :estadoDisponible', { estadoDisponible: 'disponible' })
      .andWhere('turno.id IS NULL') // No tiene turnos en conflicto
      .setParameters({
        fecha,
        horaInicio,
        horaFin,
        estado: 'en_progreso',
      })
      .orderBy('caddie.nivel_experiencia', 'DESC')
      .addOrderBy('caddie.nombre', 'ASC')
      .getMany();
  }

  async updateEstado(id: string, estado: string): Promise<Caddie> {
    const caddie = await this.findOne(id);
    caddie.estado = estado;
    return await this.caddieRepository.save(caddie);
  }
}