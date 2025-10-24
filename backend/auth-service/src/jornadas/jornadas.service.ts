import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { JornadaTurno } from './entities/jornada-turno.entity';
import { CreateJornadaTurnoDto } from './dto/create-jornada-turno.dto';
import { UpdateJornadaTurnoDto } from './dto/update-jornada-turno.dto';

@Injectable()
export class JornadasService {
  constructor(
    @InjectRepository(JornadaTurno)
    private jornadasRepository: Repository<JornadaTurno>,
  ) {}

  async create(createJornadaTurnoDto: CreateJornadaTurnoDto): Promise<JornadaTurno> {
    const jornada = this.jornadasRepository.create({
      ...createJornadaTurnoDto,
      totalTurnos: createJornadaTurnoDto.totalTurnos || this.contarTurnosEnDatos(createJornadaTurnoDto.datosTurnos)
    });
    
    return await this.jornadasRepository.save(jornada);
  }

  async findAll(
    page: number = 1, 
    limit: number = 10,
    fechaInicio?: string,
    fechaFin?: string,
    busqueda?: string,
    activa?: boolean
  ): Promise<{ jornadas: JornadaTurno[]; total: number; totalPages: number }> {
    const queryBuilder = this.jornadasRepository.createQueryBuilder('jornada');

    // Filtros de fecha
    if (fechaInicio && fechaFin) {
      queryBuilder.andWhere('jornada.fechaJornada BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin
      });
    } else if (fechaInicio) {
      queryBuilder.andWhere('jornada.fechaJornada >= :fechaInicio', { fechaInicio });
    } else if (fechaFin) {
      queryBuilder.andWhere('jornada.fechaJornada <= :fechaFin', { fechaFin });
    }

    // Filtro de búsqueda por nombre
    if (busqueda) {
      queryBuilder.andWhere('jornada.nombreJornada ILIKE :busqueda', {
        busqueda: `%${busqueda}%`
      });
    }

    // Filtro por estado activa
    if (activa !== undefined) {
      queryBuilder.andWhere('jornada.activa = :activa', { activa });
    }

    // Ordenamiento por fecha descendente
    queryBuilder.orderBy('jornada.fechaJornada', 'DESC');
    queryBuilder.addOrderBy('jornada.fechaCreacion', 'DESC');

    // Paginación
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [jornadas, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      jornadas,
      total,
      totalPages
    };
  }

  async findOne(id: string): Promise<JornadaTurno> {
    const jornada = await this.jornadasRepository.findOne({
      where: { id }
    });

    if (!jornada) {
      throw new NotFoundException(`Jornada con ID ${id} no encontrada`);
    }

    return jornada;
  }

  async update(id: string, updateJornadaTurnoDto: UpdateJornadaTurnoDto): Promise<JornadaTurno> {
    const jornada = await this.findOne(id);

    // Si se actualizan los datos de turnos, recalcular el total
    if (updateJornadaTurnoDto.datosTurnos) {
      updateJornadaTurnoDto.totalTurnos = this.contarTurnosEnDatos(updateJornadaTurnoDto.datosTurnos);
    }

    Object.assign(jornada, updateJornadaTurnoDto);
    return await this.jornadasRepository.save(jornada);
  }

  async remove(id: string): Promise<void> {
    const result = await this.jornadasRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Jornada con ID ${id} no encontrada`);
    }
  }

  async toggleActiva(id: string): Promise<JornadaTurno> {
    const jornada = await this.findOne(id);
    jornada.activa = !jornada.activa;
    return await this.jornadasRepository.save(jornada);
  }

  async findByFecha(fecha: string): Promise<JornadaTurno[]> {
    return await this.jornadasRepository.find({
      where: { fechaJornada: new Date(fecha) },
      order: { fechaCreacion: 'DESC' }
    });
  }

  async getEstadisticas(): Promise<{
    totalJornadas: number;
    jornadasActivas: number;
    jornadasInactivas: number;
    totalTurnosGuardados: number;
    promedioTurnosPorJornada: number;
  }> {
    const [
      totalJornadas,
      jornadasActivas,
      jornadasInactivas,
      sumaTurnos
    ] = await Promise.all([
      this.jornadasRepository.count(),
      this.jornadasRepository.count({ where: { activa: true } }),
      this.jornadasRepository.count({ where: { activa: false } }),
      this.jornadasRepository
        .createQueryBuilder('jornada')
        .select('SUM(jornada.totalTurnos)', 'total')
        .getRawOne()
    ]);

    const totalTurnosGuardados = parseInt(sumaTurnos?.total || '0');
    const promedioTurnosPorJornada = totalJornadas > 0 ? totalTurnosGuardados / totalJornadas : 0;

    return {
      totalJornadas,
      jornadasActivas,
      jornadasInactivas,
      totalTurnosGuardados,
      promedioTurnosPorJornada: Math.round(promedioTurnosPorJornada * 100) / 100
    };
  }

  private contarTurnosEnDatos(datosTurnos: any): number {
    if (!datosTurnos || !Array.isArray(datosTurnos)) {
      return 0;
    }
    return datosTurnos.length;
  }
}