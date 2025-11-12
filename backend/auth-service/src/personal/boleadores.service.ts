import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boleador } from '../turnos/entities/boleador.entity';
import { CreateBoleadorDto } from './dto/create-boleador.dto';
import { UpdateBoleadorDto } from './dto/update-boleador.dto';

@Injectable()
export class BoleadoresService {
  constructor(
    @InjectRepository(Boleador)
    private boleadorRepository: Repository<Boleador>,
  ) {}

  async create(createBoleadorDto: CreateBoleadorDto): Promise<Boleador> {
    const boleador = this.boleadorRepository.create(createBoleadorDto);
    return await this.boleadorRepository.save(boleador);
  }

  async findAll(clubId?: string): Promise<Boleador[]> {
    const whereCondition = clubId ? { clubId, activo: true } : { activo: true };
    return await this.boleadorRepository.find({
      where: whereCondition,
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Boleador> {
    const boleador = await this.boleadorRepository.findOne({
      where: { id },
      relations: ['turnos_como_boleador'],
    });
    
    if (!boleador) {
      throw new NotFoundException(`Boleador con ID ${id} no encontrado`);
    }
    
    return boleador;
  }

  async update(id: string, updateBoleadorDto: UpdateBoleadorDto): Promise<Boleador> {
    const boleador = await this.findOne(id);
    Object.assign(boleador, updateBoleadorDto);
    return await this.boleadorRepository.save(boleador);
  }

  async remove(id: string): Promise<void> {
    const boleador = await this.findOne(id);
    boleador.activo = false;
    await this.boleadorRepository.save(boleador);
  }

  async findAvailableByDateTime(clubId: string, fecha: string, horaInicio: string, horaFin: string): Promise<Boleador[]> {
    // Consulta para encontrar boleadores disponibles en el horario específico
    return await this.boleadorRepository
      .createQueryBuilder('boleador')
      .leftJoin('boleador.turnos_como_boleador', 'turno', 
        'turno.fecha = :fecha AND turno.estado = :estado AND ' +
        '((turno.hora_inicio < :horaFin AND turno.hora_fin > :horaInicio))'
      )
      .where('boleador.clubId = :clubId', { clubId })
      .andWhere('boleador.activo = true')
      .andWhere('boleador.estado = :estadoDisponible', { estadoDisponible: 'disponible' })
      .andWhere('turno.id IS NULL') // No tiene turnos en conflicto
      .setParameters({
        fecha,
        horaInicio,
        horaFin,
        estado: 'en_progreso',
      })
      .orderBy('boleador.ranking_habilidad', 'DESC')
      .addOrderBy('boleador.nombre', 'ASC')
      .getMany();
  }

  async updateEstado(id: string, estado: string): Promise<Boleador> {
    const boleador = await this.findOne(id);
    boleador.estado = estado;
    return await this.boleadorRepository.save(boleador);
  }

  async findByNivelJuego(clubId: string, nivelJuego: string): Promise<Boleador[]> {
    return await this.boleadorRepository.find({
      where: {
        clubId,
        nivel_juego: nivelJuego,
        activo: true,
        estado: 'disponible',
      },
      order: { ranking_habilidad: 'DESC' },
    });
  }
}