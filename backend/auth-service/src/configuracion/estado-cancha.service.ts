import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoCancha } from './entities/estado-cancha.entity';
import { CreateEstadoCanchaDto, UpdateEstadoCanchaDto } from './dto/estado-cancha.dto';

@Injectable()
export class EstadoCanchaService {
  constructor(
    @InjectRepository(EstadoCancha)
    private readonly estadoCanchaRepository: Repository<EstadoCancha>,
  ) {}

  async create(createDto: CreateEstadoCanchaDto, clubId: string): Promise<EstadoCancha> {
    // Si se marca como predeterminado, desmarcar otros
    if (createDto.esPredeterminado) {
      await this.estadoCanchaRepository.update(
        { clubId, esPredeterminado: true },
        { esPredeterminado: false }
      );
    }

    const estadoCancha = this.estadoCanchaRepository.create({
      ...createDto,
      clubId,
    });

    return await this.estadoCanchaRepository.save(estadoCancha);
  }

  async findAllByClub(clubId: string): Promise<EstadoCancha[]> {
    return await this.estadoCanchaRepository.find({
      where: { clubId },
      order: { orden: 'ASC', nombre: 'ASC' },
    });
  }

  async findActiveByClub(clubId: string): Promise<EstadoCancha[]> {
    return await this.estadoCanchaRepository.find({
      where: { clubId, activa: true },
      order: { orden: 'ASC', nombre: 'ASC' },
    });
  }

  async findOne(id: number, clubId: string): Promise<EstadoCancha> {
    const estadoCancha = await this.estadoCanchaRepository.findOne({
      where: { id, clubId },
    });

    if (!estadoCancha) {
      throw new NotFoundException('Estado de cancha no encontrado');
    }

    return estadoCancha;
  }

  async update(id: number, updateDto: UpdateEstadoCanchaDto, clubId: string): Promise<EstadoCancha> {
    const estadoCancha = await this.findOne(id, clubId);
    
    // Si se marca como predeterminado, desmarcar otros
    if (updateDto.esPredeterminado && !estadoCancha.esPredeterminado) {
      await this.estadoCanchaRepository.update(
        { clubId, esPredeterminado: true },
        { esPredeterminado: false }
      );
    }
    
    Object.assign(estadoCancha, updateDto);
    
    return await this.estadoCanchaRepository.save(estadoCancha);
  }

  async remove(id: number, clubId: string): Promise<void> {
    const estadoCancha = await this.findOne(id, clubId);
    
    // No permitir eliminar estados predeterminados
    if (estadoCancha.esPredeterminado) {
      throw new ConflictException('No se puede eliminar el estado predeterminado del sistema');
    }
    
    // Verificar si hay canchas usando este estado y obtener nombres
    const canchasUsandoEstado = await this.estadoCanchaRepository.query(
      `SELECT c.nombre 
       FROM auth.canchas c
       WHERE c.estado_id = $1 AND c.club_id = $2
       LIMIT 5`,
      [id, clubId]
    );

    if (canchasUsandoEstado.length > 0) {
      const nombresCanchas = canchasUsandoEstado.map((c: any) => c.nombre).join(', ');
      const mensaje = canchasUsandoEstado.length === 1
        ? `No se puede eliminar. La cancha "${nombresCanchas}" está usando este estado. Cámbiala primero desde Gestión de Canchas.`
        : `No se puede eliminar. ${canchasUsandoEstado.length} canchas están usando este estado: ${nombresCanchas}. Cámbialas primero desde Gestión de Canchas.`;
      
      throw new ConflictException(mensaje);
    }
    
    await this.estadoCanchaRepository.remove(estadoCancha);
  }

  async toggleActive(id: number, clubId: string): Promise<EstadoCancha> {
    const estadoCancha = await this.findOne(id, clubId);
    
    estadoCancha.activa = !estadoCancha.activa;
    
    return await this.estadoCanchaRepository.save(estadoCancha);
  }

  async getEstadoPredeterminado(clubId: string): Promise<EstadoCancha | null> {
    return await this.estadoCanchaRepository.findOne({
      where: { clubId, esPredeterminado: true, activa: true },
    });
  }

  // Crear estados predeterminados al registrar club
  async crearEstadosPredeterminados(clubId: string): Promise<void> {
    const estadosPredeterminados = [
      {
        nombre: 'Disponible',
        descripcion: 'Cancha disponible para reservas',
        color: '#10B981',
        icono: 'CheckCircle',
        permiteReservas: true,
        visibleEnTurnos: true,
        esPredeterminado: true,
        orden: 1,
      },
      {
        nombre: 'En Uso',
        descripcion: 'Cancha actualmente ocupada',
        color: '#3B82F6',
        icono: 'Users',
        permiteReservas: false,
        visibleEnTurnos: true,
        orden: 2,
      },
      {
        nombre: 'Mantenimiento',
        descripcion: 'Cancha en mantenimiento',
        color: '#F59E0B',
        icono: 'Wrench',
        permiteReservas: false,
        visibleEnTurnos: false,
        orden: 3,
      },
      {
        nombre: 'Fuera de Servicio',
        descripcion: 'Cancha no disponible temporalmente',
        color: '#EF4444',
        icono: 'XCircle',
        permiteReservas: false,
        visibleEnTurnos: false,
        orden: 4,
      },
    ];

    for (const estado of estadosPredeterminados) {
      await this.estadoCanchaRepository.save({
        ...estado,
        clubId,
        activa: true,
      });
    }
  }
}
