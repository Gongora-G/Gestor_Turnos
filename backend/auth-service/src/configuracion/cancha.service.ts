import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cancha } from './entities/cancha.entity';
import { CreateCanchaDto, UpdateCanchaDto } from './dto/cancha.dto';

@Injectable()
export class CanchaService {
  constructor(
    @InjectRepository(Cancha)
    private readonly canchaRepository: Repository<Cancha>,
  ) {}

  async create(createDto: CreateCanchaDto, clubId: string): Promise<Cancha> {
    const cancha = this.canchaRepository.create({
      ...createDto,
      clubId,
    });

    return await this.canchaRepository.save(cancha);
  }

  async findAllByClub(clubId: string): Promise<Cancha[]> {
    return await this.canchaRepository.find({
      where: { clubId },
      order: { createdAt: 'ASC' },
    });
  }

  async findActiveByClub(clubId: string): Promise<Cancha[]> {
    return await this.canchaRepository.find({
      where: { clubId, activa: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string, clubId: string): Promise<Cancha> {
    const cancha = await this.canchaRepository.findOne({
      where: { id, clubId },
    });

    if (!cancha) {
      throw new NotFoundException('Cancha no encontrada');
    }

    return cancha;
  }

  async update(id: string, updateDto: UpdateCanchaDto, clubId: string): Promise<Cancha> {
    const cancha = await this.findOne(id, clubId);
    
    Object.assign(cancha, updateDto);
    
    return await this.canchaRepository.save(cancha);
  }

  async remove(id: string, clubId: string): Promise<void> {
    const cancha = await this.findOne(id, clubId);
    
    await this.canchaRepository.remove(cancha);
  }

  async toggleActive(id: string, clubId: string): Promise<Cancha> {
    const cancha = await this.findOne(id, clubId);
    
    cancha.activa = !cancha.activa;
    
    return await this.canchaRepository.save(cancha);
  }
}