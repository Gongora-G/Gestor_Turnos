import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Turno } from './entities/turno.entity';
import { Cancha } from '../configuracion/entities/cancha.entity';
import { CreateTurnoDto, UpdateTurnoDto, FiltrosTurnosDto } from './dto/turno.dto';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private turnosRepository: Repository<Turno>,
    @InjectRepository(Cancha)
    private canchasRepository: Repository<Cancha>,
  ) {}

  async create(createTurnoDto: CreateTurnoDto, clubId: string): Promise<Turno> {
    // Generar nombre automático secuencial para el día
    const { nombreAutomatico, numeroTurnoDia } = await this.generarNombreSecuencial(createTurnoDto.fecha, clubId);
    
    const turno = this.turnosRepository.create({
      ...createTurnoDto,
      nombre: nombreAutomatico,
      numero_turno_dia: numeroTurnoDia,
      club_id: clubId,
    });

    return await this.turnosRepository.save(turno);
  }

  private async generarNombreSecuencial(fecha: string, clubId: string): Promise<{nombreAutomatico: string, numeroTurnoDia: number}> {
    // Extraer solo la fecha (YYYY-MM-DD)
    const fechaSolo = fecha.split('T')[0];
    
    // Usar MAX para obtener el número más alto del día y evitar problemas de concurrencia
    const resultado = await this.turnosRepository
      .createQueryBuilder('turno')
      .select('MAX(turno.numero_turno_dia)', 'maxNumero')
      .where('turno.fecha = :fecha AND turno.club_id = :clubId', { fecha: fechaSolo, clubId })
      .getRawOne();

    // Generar número secuencial (empezando desde 1)
    const numeroTurnoDia = (resultado?.maxNumero || 0) + 1;
    const numeroSecuencial = numeroTurnoDia.toString().padStart(3, '0');
    
    return {
      nombreAutomatico: `Turno - ${numeroSecuencial}`,
      numeroTurnoDia: numeroTurnoDia
    };
  }

  async findAll(filtros: FiltrosTurnosDto, clubId: string): Promise<any[]> {
    const query = this.turnosRepository.createQueryBuilder('turno')
      .where('turno.club_id = :clubId', { clubId });

    // Si no se especifican filtros de fecha, mostrar solo turnos del día actual
    if (!filtros.fecha_inicio && !filtros.fecha_fin) {
      const hoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      query.andWhere('turno.fecha = :hoy', { hoy });
    } else {
      // Aplicar filtros de fecha si se especifican
      if (filtros.fecha_inicio && filtros.fecha_fin) {
        query.andWhere('turno.fecha BETWEEN :fechaInicio AND :fechaFin', {
          fechaInicio: filtros.fecha_inicio,
          fechaFin: filtros.fecha_fin,
        });
      } else if (filtros.fecha_inicio) {
        query.andWhere('turno.fecha >= :fechaInicio', { fechaInicio: filtros.fecha_inicio });
      } else if (filtros.fecha_fin) {
        query.andWhere('turno.fecha <= :fechaFin', { fechaFin: filtros.fecha_fin });
      }
    }

    if (filtros.cancha_id) {
      query.andWhere('turno.cancha_id = :canchaId', { canchaId: filtros.cancha_id });
    }

    if (filtros.estado) {
      query.andWhere('turno.estado = :estado', { estado: filtros.estado });
    }

    if (filtros.usuario_id) {
      query.andWhere('turno.usuario_id = :usuarioId', { usuarioId: filtros.usuario_id });
    }

    if (filtros.socio_id) {
      query.andWhere('turno.socio_id = :socioId', { socioId: filtros.socio_id });
    }

    const turnos = await query
      .orderBy('turno.fecha', 'DESC')
      .addOrderBy('turno.numero_turno_dia', 'ASC')
      .getMany();

    // Obtener IDs únicos de canchas
    const canchaIds = [...new Set(turnos.map(t => t.cancha_id).filter(Boolean))];
    
    // Cargar canchas en una sola consulta
    const canchas = await this.canchasRepository.findByIds(canchaIds);
    const canchasMap = new Map(canchas.map(c => [c.id, c]));

    // Combinar turnos con información de canchas
    return turnos.map(turno => ({
      ...turno,
      cancha: canchasMap.get(turno.cancha_id) || null
    }));
  }

  async findOne(id: string, clubId: string): Promise<Turno> {
    const turno = await this.turnosRepository.findOne({
      where: { id, club_id: clubId },
    });

    if (!turno) {
      throw new NotFoundException('Turno no encontrado');
    }

    return turno;
  }

  async update(id: string, updateTurnoDto: UpdateTurnoDto, clubId: string): Promise<Turno> {
    const turno = await this.findOne(id, clubId);

    Object.assign(turno, updateTurnoDto);
    return await this.turnosRepository.save(turno);
  }

  async remove(id: string, clubId: string): Promise<void> {
    const turno = await this.findOne(id, clubId);
    await this.turnosRepository.remove(turno);
  }

  async cambiarEstado(id: string, estado: string, clubId: string): Promise<Turno> {
    const turno = await this.findOne(id, clubId);
    turno.estado = estado as any;
    return await this.turnosRepository.save(turno);
  }

  async obtenerDisponibilidad(fecha: string, canchaId?: string, clubId?: string): Promise<{ hora: string; disponible: boolean }[]> {
    // Generar horarios de 6:00 a 22:00 cada hora
    const horarios: { hora: string; disponible: boolean }[] = [];
    for (let hora = 6; hora <= 22; hora++) {
      const horaStr = `${hora.toString().padStart(2, '0')}:00`;
      horarios.push({ hora: horaStr, disponible: true });
    }

    // Consultar turnos ocupados
    const query = this.turnosRepository.createQueryBuilder('turno')
      .where('turno.fecha = :fecha', { fecha })
      .andWhere('turno.estado != :estado', { estado: 'cancelada' });

    if (canchaId) {
      query.andWhere('turno.cancha_id = :canchaId', { canchaId });
    }

    if (clubId) {
      query.andWhere('turno.club_id = :clubId', { clubId });
    }

    const turnosOcupados = await query.getMany();

    // Marcar horarios ocupados
    turnosOcupados.forEach(turno => {
      const horaInicio = turno.hora_inicio.substring(0, 5);
      const horario = horarios.find(h => h.hora === horaInicio);
      if (horario) {
        horario.disponible = false;
      }
    });

    return horarios;
  }
}