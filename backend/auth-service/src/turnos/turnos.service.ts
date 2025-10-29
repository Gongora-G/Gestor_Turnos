import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Turno } from './entities/turno.entity';
import { Cancha } from '../configuracion/entities/cancha.entity';
import { Socio } from '../socios/entities/socio.entity';
import { TipoMembresia } from '../configuracion/entities/tipo-membresia.entity';
import { CreateTurnoDto, UpdateTurnoDto, FiltrosTurnosDto } from './dto/turno.dto';
import { JornadasService } from '../jornadas/jornadas.service';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private turnosRepository: Repository<Turno>,
    @InjectRepository(Cancha)
    private canchasRepository: Repository<Cancha>,
    @InjectRepository(Socio)
    private sociosRepository: Repository<Socio>,
    @InjectRepository(TipoMembresia)
    private tipoMembresiaRepository: Repository<TipoMembresia>,
    private jornadasService: JornadasService,
  ) {}

  async create(createTurnoDto: CreateTurnoDto, clubId: string, usuarioId?: string): Promise<Turno> {
    console.log('🆕 Creando turno para club:', clubId);
    console.log('👤 UsuarioId recibido:', usuarioId);
    console.log('📅 Fecha recibida:', createTurnoDto.fecha, '(tipo:', typeof createTurnoDto.fecha, ')');
    console.log('⏰ Hora inicio del turno:', createTurnoDto.hora_inicio);
    
    try {      
      const { nombreAutomatico, numeroTurnoDia } = await this.generarNombreSecuencial(
        createTurnoDto.fecha, 
        clubId
      );

      // 🎯 Determinar jornada basándose en la HORA DE INICIO DEL TURNO (no la hora actual)
      let jornadaConfigId = createTurnoDto.jornada_config_id;
      if (!jornadaConfigId) {
        try {
          const jornadaParaTurno = await this.jornadasService.determinarJornadaPorHora(clubId, createTurnoDto.hora_inicio);
          if (jornadaParaTurno) {
            jornadaConfigId = jornadaParaTurno.id;
            console.log('🎯 Jornada asignada automáticamente basada en hora de inicio del turno:', jornadaParaTurno.nombre, `(ID: ${jornadaConfigId})`, `- Horario: ${jornadaParaTurno.horaInicio} a ${jornadaParaTurno.horaFin}`);
          } else {
            console.log('⚠️ No se encontró jornada para la hora de inicio:', createTurnoDto.hora_inicio);
          }
        } catch (error) {
          console.error('❌ Error al determinar jornada para el turno:', error);
          // Continuar sin jornada si hay error
        }
      }
      
      const turnoData = {
        ...createTurnoDto,
        nombre: nombreAutomatico,
        numero_turno_dia: numeroTurnoDia,
        club_id: clubId,
        jornada_config_id: jornadaConfigId, // Asignar jornada determinada
      };

      console.log('📅 Datos del turno antes de guardar:', {
        fecha: turnoData.fecha,
        hora_inicio: turnoData.hora_inicio,
        hora_fin: turnoData.hora_fin,
        jornada_config_id: turnoData.jornada_config_id
      });
      
      const turno = this.turnosRepository.create(turnoData);
      console.log('📅 Entidad turno creada:', {
        fecha: turno.fecha,
        hora_inicio: turno.hora_inicio,
        hora_fin: turno.hora_fin,
        jornada_config_id: turno.jornada_config_id
      });
      
      const turnoGuardado = await this.turnosRepository.save(turno);
      console.log('✅ Turno creado:', turnoGuardado.id, 'con jornada:', turnoGuardado.jornada_config_id);
      return turnoGuardado;
    } catch (error) {
      console.error('❌ ERROR creando turno:', error);
      throw error;
    }
  }

  private async generarNombreSecuencial(fecha: string, clubId: string): Promise<{nombreAutomatico: string, numeroTurnoDia: number}> {
    // Extraer solo la fecha (YYYY-MM-DD)
    const fechaSolo = fecha.split('T')[0];
    
    // Usar MAX para obtener el número más alto del día
    const query = this.turnosRepository
      .createQueryBuilder('turno')
      .select('MAX(turno.numero_turno_dia)', 'maxNumero')
      .where('turno.fecha = :fecha AND turno.club_id = :clubId', { fecha: fechaSolo, clubId });
    
    const resultado = await query.getRawOne();

    // Generar número secuencial (empezando desde 1)
    const numeroTurnoDia = (resultado?.maxNumero || 0) + 1;
    const numeroSecuencial = numeroTurnoDia.toString().padStart(3, '0');
    
    return {
      nombreAutomatico: `Turno - ${numeroSecuencial}`,
      numeroTurnoDia: numeroTurnoDia
    };
  }

  async findAll(filtros: FiltrosTurnosDto, clubId: string, usuarioId?: string): Promise<any[]> {
    console.log('🔍 Obteniendo turnos con filtros:', filtros);
    
    const query = this.turnosRepository.createQueryBuilder('turno')
      .where('turno.club_id = :clubId', { clubId });

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

    console.log(`✅ Se encontraron ${turnos.length} turnos`);

    // Obtener IDs únicos de canchas, socios y jornadas
    const canchaIds = [...new Set(turnos.map(t => t.cancha_id).filter(Boolean))];
    const socioIds = [...new Set(turnos.map(t => t.socio_id).filter(Boolean))];
    const jornadaConfigIds = [...new Set(turnos.map(t => t.jornada_config_id).filter(Boolean))];
    
    console.log('🔍 Turnos encontrados:', turnos.map(t => ({ id: t.id, socio_id: t.socio_id, jornada_config_id: t.jornada_config_id })));
    console.log('🔍 IDs de socios únicos:', socioIds);
    console.log('🔍 IDs de jornadas únicas:', jornadaConfigIds);
    
    // Cargar canchas, socios y jornadas
    const [canchas, socios, jornadasConfig] = await Promise.all([
      this.canchasRepository.findByIds(canchaIds),
      socioIds.length > 0 ? this.sociosRepository
        .createQueryBuilder('socio')
        .where('socio.id IN (:...socioIds)', { socioIds })
        .getMany() : [],
      jornadaConfigIds.length > 0 ? this.jornadasService.findJornadaConfigByIds(jornadaConfigIds) : []
    ]);

    // Obtener IDs únicos de tipos de membresía y cargarlos
    const tipoMembresiaIds = [...new Set(socios.map(s => s.tipo_membresia_id).filter(Boolean))];
    const tiposMembresia = tipoMembresiaIds.length > 0 ? 
      await this.tipoMembresiaRepository.findByIds(tipoMembresiaIds) : [];
    
    console.log('✅ Socios cargados:', socios.map(s => ({ id: s.id, nombre: s.nombre, apellido: s.apellido })));
    console.log('✅ Tipos de membresía cargados:', tiposMembresia.map(tm => ({ id: tm.id, nombre: tm.nombre })));
    console.log('✅ Jornadas cargadas:', jornadasConfig.map(j => ({ id: j.id, nombre: j.nombre })));
    
    const canchasMap = new Map(canchas.map(c => [c.id, c]));
    const tipoMembresiaMap = new Map(tiposMembresia.map(tm => [tm.id, tm]));
    const jornadasMap = new Map<number, any>();
    jornadasConfig.forEach((jornada: any) => jornadasMap.set(jornada.id, jornada));
    const sociosMap = new Map<string, any>();
    socios.forEach((socio: any) => sociosMap.set(socio.id, socio));

    // Combinar turnos con información de canchas, socios y jornadas
    return turnos.map(turno => {
      const socio: any = sociosMap.get(turno.socio_id);
      const jornadaConfig: any = jornadasMap.get(turno.jornada_config_id);
      console.log(`🔍 Turno ${turno.id}: socio_id=${turno.socio_id}, socio encontrado:`, socio ? 'SÍ' : 'NO', ', jornada_config_id=', turno.jornada_config_id, ', jornada encontrada:', jornadaConfig ? 'SÍ' : 'NO');
      
      // Obtener tipo de membresía del socio si existe
      const tipoMembresia = socio ? tipoMembresiaMap.get(socio.tipo_membresia_id) : null;
      
      const resultado = {
        ...turno,
        cancha: canchasMap.get(turno.cancha_id) || null,
        jornada_config: jornadaConfig ? {
          id: jornadaConfig.id,
          codigo: jornadaConfig.codigo,
          nombre: jornadaConfig.nombre,
          hora_inicio: jornadaConfig.horaInicio,
          hora_fin: jornadaConfig.horaFin,
          color: jornadaConfig.color
        } : null,
        socio: socio ? {
          id: socio.id,
          nombre: `${socio.nombre} ${socio.apellido}`,
          email: socio.email,
          documento: socio.documento,
          tipo_membresia: tipoMembresia?.nombre || null,
          tipo_membresia_color: tipoMembresia?.color || null,
          estado: socio.estado,
        } : null
      };
      
      console.log(`✅ Resultado para turno ${turno.id}:`, {
        socio_id: resultado.socio_id,
        socio: resultado.socio,
        jornada_config: resultado.jornada_config,
        tipo_membresia: tipoMembresia?.nombre || 'Sin tipo'
      });
      
      return resultado;
    });
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