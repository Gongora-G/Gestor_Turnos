import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Personal } from './entities/personal.entity';
import { TipoPersonal } from './entities/tipo-personal.entity';
import { EstadoPersonal } from '../configuracion/entities/estado-personal.entity';
import { CreatePersonalDto, UpdatePersonalDto } from './dto/personal.dto';

@Injectable()
export class PersonalService {
  constructor(
    @InjectRepository(Personal)
    private personalRepository: Repository<Personal>,
    @InjectRepository(TipoPersonal)
    private tiposPersonalRepository: Repository<TipoPersonal>,
    @InjectRepository(EstadoPersonal)
    private estadoPersonalRepository: Repository<EstadoPersonal>,
  ) {}

  async create(createDto: CreatePersonalDto): Promise<Personal> {
    // Verificar que el tipo de personal existe y está activo
    const tipoPersonal = await this.tiposPersonalRepository.findOne({
      where: { id: createDto.tipoPersonalId },
    });

    if (!tipoPersonal) {
      throw new NotFoundException(
        `Tipo de personal con ID ${createDto.tipoPersonalId} no encontrado`,
      );
    }

    if (!tipoPersonal.activo) {
      throw new BadRequestException(
        `El tipo de personal '${tipoPersonal.nombre}' no está activo`,
      );
    }

    const personal = this.personalRepository.create(createDto);
    return await this.personalRepository.save(personal);
  }

  async findAll(clubId: string, tipoPersonalId?: number): Promise<Personal[]> {
    const where: any = { clubId };
    
    if (tipoPersonalId) {
      where.tipoPersonalId = tipoPersonalId;
    }

    return await this.personalRepository.find({
      where,
      relations: ['tipoPersonal'],
      order: { nombre: 'ASC', apellido: 'ASC' },
    });
  }

  async findAllActivos(clubId: string, tipoPersonalId?: number): Promise<Personal[]> {
    const where: any = { clubId, activo: true };
    
    if (tipoPersonalId) {
      where.tipoPersonalId = tipoPersonalId;
    }

    return await this.personalRepository.find({
      where,
      relations: ['tipoPersonal'],
      order: { nombre: 'ASC', apellido: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Personal> {
    const personal = await this.personalRepository.findOne({
      where: { id },
      relations: ['tipoPersonal'],
    });

    if (!personal) {
      throw new NotFoundException(`Personal con ID ${id} no encontrado`);
    }

    return personal;
  }

  async findByTipo(clubId: string, codigoTipo: string): Promise<Personal[]> {
    return await this.personalRepository
      .createQueryBuilder('personal')
      .leftJoinAndSelect('personal.tipoPersonal', 'tipo')
      .where('personal.clubId = :clubId', { clubId })
      .andWhere('tipo.codigo = :codigoTipo', { codigoTipo })
      .andWhere('personal.activo = :activo', { activo: true })
      .orderBy('personal.nombre', 'ASC')
      .addOrderBy('personal.apellido', 'ASC')
      .getMany();
  }

  async findDisponibles(
    clubId: string,
    tipoPersonalId?: number,
  ): Promise<Personal[]> {
    // Usar query builder para una búsqueda más robusta
    const query = this.personalRepository
      .createQueryBuilder('personal')
      .leftJoinAndSelect('personal.tipoPersonal', 'tipoPersonal')
      .leftJoinAndSelect('personal.estadoObj', 'estadoObj')
      .where('personal.clubId = :clubId', { clubId })
      .andWhere('personal.activo = :activo', { activo: true })
      // Buscar por campo deprecado o por estado relacionado
      .andWhere(
        '(LOWER(personal.estado) = :estadoStr OR LOWER(estadoObj.nombre) = :estadoStr)',
        { estadoStr: 'disponible' }
      );

    if (tipoPersonalId) {
      query.andWhere('personal.tipoPersonalId = :tipoPersonalId', { tipoPersonalId });
    }

    return await query
      .orderBy('personal.nombre', 'ASC')
      .addOrderBy('personal.apellido', 'ASC')
      .getMany();
  }

  async update(id: string, updateDto: UpdatePersonalDto): Promise<Personal> {
    const personal = await this.findOne(id);

    // Si se está cambiando el tipo, verificar que existe y está activo
    if (updateDto.tipoPersonalId && updateDto.tipoPersonalId !== personal.tipoPersonalId) {
      const tipoPersonal = await this.tiposPersonalRepository.findOne({
        where: { id: updateDto.tipoPersonalId },
      });

      if (!tipoPersonal) {
        throw new NotFoundException(
          `Tipo de personal con ID ${updateDto.tipoPersonalId} no encontrado`,
        );
      }

      if (!tipoPersonal.activo) {
        throw new BadRequestException(
          `El tipo de personal '${tipoPersonal.nombre}' no está activo`,
        );
      }
    }

    Object.assign(personal, updateDto);
    return await this.personalRepository.save(personal);
  }

  async updateEstado(
    id: string,
    estado: string,
  ): Promise<Personal> {
    const personal = await this.findOne(id);
    
    // Buscar el estado por nombre (case-insensitive) - sin filtrar por clubId por ahora
    const estadoObj = await this.estadoPersonalRepository.findOne({
      where: { 
        nombre: estado.toLowerCase(),
        activo: true,
      },
    });

    if (!estadoObj) {
      console.warn(`⚠️ Estado '${estado}' no encontrado en tabla estado_personal. Actualizando solo campo deprecado.`);
      personal.estado = estado.toLowerCase();
      return await this.personalRepository.save(personal);
    }

    personal.estadoId = estadoObj.id;
    personal.estado = estado.toLowerCase(); // Mantener sincronizado el campo deprecado
    return await this.personalRepository.save(personal);
  }

  async updateEstadoPorNombre(
    id: string,
    nombreEstado: string,
    clubId: string | number,
  ): Promise<Personal> {
    console.log(`📝 Actualizando estado del personal ${id} a "${nombreEstado}" (Club: ${clubId})`);
    const personal = await this.findOne(id);
    console.log(`✅ Personal encontrado:`, personal.nombre, personal.apellido);
    
    // Convertir clubId a string si viene como número (para compatibilidad)
    const clubIdStr = typeof clubId === 'number' ? String(clubId) : clubId;
    
    // Buscar el estado por nombre (case-insensitive)
    const estadoObj = await this.estadoPersonalRepository.findOne({
      where: { 
        clubId: clubIdStr as any,
        nombre: nombreEstado,
        activo: true,
      },
    });

    console.log(`🔍 Estado buscado: "${nombreEstado}" en club ${clubId}`, estadoObj ? '✅ Encontrado' : '❌ No encontrado');

    if (!estadoObj) {
      // Si no existe el estado, crearlo o actualizar solo el campo deprecado
      console.warn(`⚠️ Estado '${nombreEstado}' no encontrado en tabla estado_personal. Actualizando solo campo deprecado.`);
      personal.estado = nombreEstado.toLowerCase(); // Usar campo deprecado
      return await this.personalRepository.save(personal);
    }

    personal.estadoId = estadoObj.id;
    personal.estado = nombreEstado.toLowerCase(); // Mantener sincronizado el campo deprecado
    console.log(`✅ Guardando personal con estadoId: ${estadoObj.id}, estado: ${nombreEstado}`);
    return await this.personalRepository.save(personal);
  }

  async remove(id: string): Promise<void> {
    const personal = await this.findOne(id);
    await this.personalRepository.remove(personal);
  }

  async softDelete(id: string): Promise<Personal> {
    const personal = await this.findOne(id);
    personal.activo = false;
    return await this.personalRepository.save(personal);
  }

  // Estadísticas
  async getEstadisticas(clubId: string): Promise<any> {
    const total = await this.personalRepository.count({
      where: { clubId, activo: true },
    });

    const disponibles = await this.personalRepository.count({
      where: { clubId, activo: true, estado: 'disponible' },
    });

    const ocupados = await this.personalRepository.count({
      where: { clubId, activo: true, estado: 'ocupado' },
    });

    const porTipo = await this.personalRepository
      .createQueryBuilder('personal')
      .select('tipo.nombre', 'tipo')
      .addSelect('COUNT(personal.id)', 'cantidad')
      .leftJoin('personal.tipoPersonal', 'tipo')
      .where('personal.clubId = :clubId', { clubId })
      .andWhere('personal.activo = :activo', { activo: true })
      .groupBy('tipo.nombre')
      .getRawMany();

    return {
      total,
      disponibles,
      ocupados,
      porTipo,
    };
  }
}
