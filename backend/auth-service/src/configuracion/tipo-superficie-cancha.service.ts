import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoSuperficieCancha } from './entities/tipo-superficie-cancha.entity';
import { CreateTipoSuperficieCanchaDto, UpdateTipoSuperficieCanchaDto } from './dto/tipo-superficie-cancha.dto';

@Injectable()
export class TipoSuperficieCanchaService {
  constructor(
    @InjectRepository(TipoSuperficieCancha)
    private readonly tipoSuperficieRepository: Repository<TipoSuperficieCancha>,
  ) {}

  async create(createDto: CreateTipoSuperficieCanchaDto, clubId: string): Promise<TipoSuperficieCancha> {
    const tipoSuperficie = this.tipoSuperficieRepository.create({
      ...createDto,
      clubId,
    });

    return await this.tipoSuperficieRepository.save(tipoSuperficie);
  }

  async findAllByClub(clubId: string): Promise<TipoSuperficieCancha[]> {
    return await this.tipoSuperficieRepository.find({
      where: { clubId },
      order: { orden: 'ASC', nombre: 'ASC' },
    });
  }

  async findActiveByClub(clubId: string): Promise<TipoSuperficieCancha[]> {
    return await this.tipoSuperficieRepository.find({
      where: { clubId, activa: true },
      order: { orden: 'ASC', nombre: 'ASC' },
    });
  }

  async findOne(id: number, clubId: string): Promise<TipoSuperficieCancha> {
    const tipoSuperficie = await this.tipoSuperficieRepository.findOne({
      where: { id, clubId },
    });

    if (!tipoSuperficie) {
      throw new NotFoundException('Tipo de superficie no encontrado');
    }

    return tipoSuperficie;
  }

  async update(id: number, updateDto: UpdateTipoSuperficieCanchaDto, clubId: string): Promise<TipoSuperficieCancha> {
    const tipoSuperficie = await this.findOne(id, clubId);
    
    Object.assign(tipoSuperficie, updateDto);
    
    return await this.tipoSuperficieRepository.save(tipoSuperficie);
  }

  async remove(id: number, clubId: string): Promise<void> {
    const tipoSuperficie = await this.findOne(id, clubId);
    
    // Verificar si hay canchas usando este tipo
    const canchasCount = await this.tipoSuperficieRepository
      .createQueryBuilder('tipo')
      .leftJoin('canchas', 'cancha', 'cancha.superficie_id = tipo.id')
      .where('tipo.id = :id', { id })
      .andWhere('tipo.club_id = :clubId', { clubId })
      .getCount();

    if (canchasCount > 0) {
      throw new ConflictException('No se puede eliminar. Hay canchas usando este tipo de superficie');
    }
    
    await this.tipoSuperficieRepository.remove(tipoSuperficie);
  }

  async toggleActive(id: number, clubId: string): Promise<TipoSuperficieCancha> {
    const tipoSuperficie = await this.findOne(id, clubId);
    
    tipoSuperficie.activa = !tipoSuperficie.activa;
    
    return await this.tipoSuperficieRepository.save(tipoSuperficie);
  }

  // Crear tipos de superficie predeterminados al registrar club
  async crearTiposPredeterminados(clubId: string): Promise<void> {
    const tiposPredeterminados = [
      {
        nombre: 'Arcilla / Polvo de Ladrillo',
        descripcion: 'Superficie tradicional de arcilla roja',
        color: '#D2691E',
        velocidad: 'lenta',
        requiereMantenimientoEspecial: true,
        orden: 1,
      },
      {
        nombre: 'Cemento / Dura',
        descripcion: 'Superficie dura de cemento',
        color: '#808080',
        velocidad: 'rapida',
        requiereMantenimientoEspecial: false,
        orden: 2,
      },
      {
        nombre: 'Césped Natural',
        descripcion: 'Superficie de césped natural',
        color: '#228B22',
        velocidad: 'rapida',
        requiereMantenimientoEspecial: true,
        orden: 3,
      },
      {
        nombre: 'Césped Sintético',
        descripcion: 'Superficie sintética tipo césped',
        color: '#32CD32',
        velocidad: 'media',
        requiereMantenimientoEspecial: false,
        orden: 4,
      },
    ];

    for (const tipo of tiposPredeterminados) {
      await this.tipoSuperficieRepository.save({
        ...tipo,
        clubId,
        activa: true,
      });
    }
  }
}
