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
    
    // Verificar si hay canchas usando este tipo y obtener nombres
    const canchasUsandoTipo = await this.tipoSuperficieRepository.query(
      `SELECT c.nombre 
       FROM auth.canchas c
       WHERE c.superficie_id = $1 AND c.club_id = $2
       LIMIT 5`,
      [id, clubId]
    );

    if (canchasUsandoTipo.length > 0) {
      const nombresCanchas = canchasUsandoTipo.map((c: any) => c.nombre).join(', ');
      const mensaje = canchasUsandoTipo.length === 1
        ? `No se puede eliminar. La cancha "${nombresCanchas}" está usando este tipo de superficie. Cámbiala primero desde Gestión de Canchas.`
        : `No se puede eliminar. ${canchasUsandoTipo.length} canchas están usando este tipo: ${nombresCanchas}. Cámbialas primero desde Gestión de Canchas.`;
      
      throw new ConflictException(mensaje);
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
