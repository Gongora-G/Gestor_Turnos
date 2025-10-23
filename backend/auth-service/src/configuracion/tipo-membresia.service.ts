import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoMembresia } from './entities/tipo-membresia.entity';
import { CreateTipoMembresiaDto, UpdateTipoMembresiaDto } from './dto/tipo-membresia.dto';

@Injectable()
export class TipoMembresiaService {
  constructor(
    @InjectRepository(TipoMembresia)
    private readonly tipoMembresiaRepository: Repository<TipoMembresia>,
  ) {}

  async create(createDto: CreateTipoMembresiaDto, clubId: string): Promise<TipoMembresia> {
    const tipoMembresia = this.tipoMembresiaRepository.create({
      ...createDto,
      clubId,
    });

    return await this.tipoMembresiaRepository.save(tipoMembresia);
  }

  async findAllByClub(clubId: string): Promise<TipoMembresia[]> {
    return await this.tipoMembresiaRepository.find({
      where: { clubId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string, clubId: string): Promise<TipoMembresia> {
    const tipoMembresia = await this.tipoMembresiaRepository.findOne({
      where: { id, clubId },
    });

    if (!tipoMembresia) {
      throw new NotFoundException('Tipo de membresía no encontrado');
    }

    return tipoMembresia;
  }

  async update(id: string, updateDto: UpdateTipoMembresiaDto, clubId: string): Promise<TipoMembresia> {
    const tipoMembresia = await this.findOne(id, clubId);
    
    Object.assign(tipoMembresia, updateDto);
    
    return await this.tipoMembresiaRepository.save(tipoMembresia);
  }

  async remove(id: string, clubId: string): Promise<void> {
    const tipoMembresia = await this.findOne(id, clubId);
    
    await this.tipoMembresiaRepository.remove(tipoMembresia);
  }

  async toggleActive(id: string, clubId: string): Promise<TipoMembresia> {
    const tipoMembresia = await this.findOne(id, clubId);
    
    tipoMembresia.activo = !tipoMembresia.activo;
    
    return await this.tipoMembresiaRepository.save(tipoMembresia);
  }
}