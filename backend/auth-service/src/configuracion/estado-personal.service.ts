import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoPersonal } from './entities/estado-personal.entity';
import { CreateEstadoPersonalDto } from './dto/create-estado-personal.dto';
import { UpdateEstadoPersonalDto } from './dto/update-estado-personal.dto';

@Injectable()
export class EstadoPersonalService {
  constructor(
    @InjectRepository(EstadoPersonal)
    private readonly estadoPersonalRepository: Repository<EstadoPersonal>,
  ) {}

  /**
   * Crear un nuevo estado de personal
   */
  async create(clubId: number, createDto: CreateEstadoPersonalDto): Promise<EstadoPersonal> {
    // Validar que no exista otro estado con el mismo nombre
    const existente = await this.estadoPersonalRepository.findOne({
      where: { clubId, nombre: createDto.nombre },
    });

    if (existente) {
      throw new BadRequestException(`Ya existe un estado con el nombre "${createDto.nombre}"`);
    }

    const estado = this.estadoPersonalRepository.create({
      ...createDto,
      clubId,
      esSistema: false, // Los estados creados manualmente no son del sistema
    });

    return this.estadoPersonalRepository.save(estado);
  }

  /**
   * Obtener todos los estados de personal del club
   */
  async findAll(clubId: number, soloActivos = false): Promise<EstadoPersonal[]> {
    const where: any = { clubId };
    if (soloActivos) {
      where.activo = true;
    }

    return this.estadoPersonalRepository.find({
      where,
      order: { esSistema: 'DESC', nombre: 'ASC' },
    });
  }

  /**
   * Obtener un estado por ID
   */
  async findOne(clubId: number, id: number): Promise<EstadoPersonal> {
    const estado = await this.estadoPersonalRepository.findOne({
      where: { id, clubId },
    });

    if (!estado) {
      throw new NotFoundException(`Estado con ID ${id} no encontrado`);
    }

    return estado;
  }

  /**
   * Buscar un estado por nombre (útil para automatización)
   */
  async findByNombre(clubId: number, nombre: string): Promise<EstadoPersonal | null> {
    return this.estadoPersonalRepository.findOne({
      where: { clubId, nombre, activo: true },
    });
  }

  /**
   * Actualizar un estado de personal
   */
  async update(clubId: number, id: number, updateDto: UpdateEstadoPersonalDto): Promise<EstadoPersonal> {
    const estado = await this.findOne(clubId, id);

    // No permitir cambiar el flag esSistema
    if (estado.esSistema && updateDto.hasOwnProperty('esSistema')) {
      throw new BadRequestException('No se puede modificar el flag de sistema');
    }

    // Si se intenta cambiar el nombre, validar que no exista otro con ese nombre
    if (updateDto.nombre && updateDto.nombre !== estado.nombre) {
      const existente = await this.estadoPersonalRepository.findOne({
        where: { clubId, nombre: updateDto.nombre },
      });

      if (existente) {
        throw new BadRequestException(`Ya existe un estado con el nombre "${updateDto.nombre}"`);
      }
    }

    Object.assign(estado, updateDto);
    return this.estadoPersonalRepository.save(estado);
  }

  /**
   * Eliminar un estado de personal
   */
  async remove(clubId: number, id: number): Promise<void> {
    const estado = await this.findOne(clubId, id);

    // No permitir eliminar estados del sistema
    if (estado.esSistema) {
      throw new BadRequestException('No se pueden eliminar estados del sistema');
    }

    // Verificar si hay personal con este estado usando la tabla personal
    const personalRepository = this.estadoPersonalRepository.manager.getRepository('personal');
    const personalConEstado = await personalRepository
      .createQueryBuilder('personal')
      .where('personal.estado_id = :estadoId', { estadoId: id })
      .andWhere('personal.clubId = :clubId', { clubId })
      .getCount();

    if (personalConEstado > 0) {
      throw new BadRequestException(
        'No se puede eliminar el estado porque hay personal asignado. Desactívalo en su lugar.',
      );
    }

    await this.estadoPersonalRepository.remove(estado);
  }

  /**
   * Activar/Desactivar un estado
   */
  async toggleActivo(clubId: number, id: number): Promise<EstadoPersonal> {
    const estado = await this.findOne(clubId, id);

    // Los estados del sistema no se pueden desactivar
    if (estado.esSistema && estado.activo) {
      throw new BadRequestException('No se pueden desactivar estados del sistema');
    }

    estado.activo = !estado.activo;
    return this.estadoPersonalRepository.save(estado);
  }

  /**
   * Inicializar estados del sistema para un club nuevo
   */
  async inicializarEstadosSistema(clubId: number): Promise<void> {
    const estadosBase = [
      {
        nombre: 'Disponible',
        color: '#10B981', // verde
        esOcupado: false,
        esSistema: true,
        activo: true,
        descripcion: 'Personal disponible para asignación',
      },
      {
        nombre: 'Ocupado',
        color: '#F59E0B', // amarillo
        esOcupado: true,
        esSistema: true,
        activo: true,
        descripcion: 'Personal asignado a un turno activo',
      },
      {
        nombre: 'Descanso',
        color: '#8B5CF6', // púrpura
        esOcupado: false,
        esSistema: false,
        activo: true,
        descripcion: 'Personal en período de descanso',
      },
      {
        nombre: 'Inactivo',
        color: '#6B7280', // gris
        esOcupado: false,
        esSistema: false,
        activo: true,
        descripcion: 'Personal temporalmente inactivo',
      },
    ];

    for (const estadoData of estadosBase) {
      const existe = await this.estadoPersonalRepository.findOne({
        where: { clubId, nombre: estadoData.nombre },
      });

      if (!existe) {
        const estado = this.estadoPersonalRepository.create({
          ...estadoData,
          clubId,
        });
        await this.estadoPersonalRepository.save(estado);
      }
    }
  }
}
