import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Turno } from './entities/turno.entity';
import { Caddie } from './entities/caddie.entity';
import { Boleador } from './entities/boleador.entity';
import { Cancha } from '../configuracion/entities/cancha.entity';
import { Socio } from '../socios/entities/socio.entity';
import { TipoMembresia } from '../configuracion/entities/tipo-membresia.entity';
import { CreateTurnoDto, UpdateTurnoDto, FiltrosTurnosDto } from './dto/turno.dto';
import { JornadasService } from '../jornadas/jornadas.service';
import { EstadoRegistro } from './entities/turno.entity';
import { PersonalService } from '../personal/personal.service';
import { EstadoPersonalService } from '../configuracion/estado-personal.service';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private turnosRepository: Repository<Turno>,
    @InjectRepository(Caddie)
    private caddiesRepository: Repository<Caddie>,
    @InjectRepository(Boleador)
    private boleadoresRepository: Repository<Boleador>,
    @InjectRepository(Cancha)
    private canchasRepository: Repository<Cancha>,
    @InjectRepository(Socio)
    private sociosRepository: Repository<Socio>,
    @InjectRepository(TipoMembresia)
    private tipoMembresiaRepository: Repository<TipoMembresia>,
    private jornadasService: JornadasService,
    private personalService: PersonalService,
    private estadoPersonalService: EstadoPersonalService,
  ) {}

  async create(createTurnoDto: CreateTurnoDto, clubId: string, usuarioId?: string): Promise<Turno> {
    console.log('🆕 Creando turno para club:', clubId);
    console.log('👤 UsuarioId recibido:', usuarioId);
    console.log('📅 Fecha recibida:', createTurnoDto.fecha, '(tipo:', typeof createTurnoDto.fecha, ')');
    console.log('⏰ Hora inicio del turno:', createTurnoDto.hora_inicio);
    console.log('🔍 DEBUG - DTO completo recibido:', JSON.stringify(createTurnoDto, null, 2));
    
    try {      
      const { nombreAutomatico, numeroTurnoDia } = await this.generarNombreSecuencial(
        createTurnoDto.fecha, 
        clubId
      );

      // 🎯 PRIORIZAR JORNADA ACTIVA ACTUAL del frontend
      let jornadaConfigId = createTurnoDto.jornada_id; // Usar la jornada activa enviada desde el frontend
      
      // Solo calcular automáticamente si NO viene jornada_id del frontend
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
      } else {
        console.log('✅ Usando jornada activa del frontend:', jornadaConfigId, '- NO recalculando basado en hora del turno');
      }
      
      const turnoData = {
        ...createTurnoDto,
        nombre: nombreAutomatico,
        numero_turno_dia: numeroTurnoDia,
        club_id: clubId,
        // Usar la jornada_id del frontend (jornada activa actual)
        jornada_config_id: jornadaConfigId,
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

      // 🎯 AUTOMATIZACIÓN: Cambiar estado del personal asignado a "Ocupado"
      if (createTurnoDto.personal_asignado && createTurnoDto.personal_asignado.length > 0) {
        await this.cambiarEstadoPersonalAsignado(
          createTurnoDto.personal_asignado,
          'Ocupado',
          parseInt(clubId)
        );
        console.log(`✅ ${createTurnoDto.personal_asignado.length} personal(es) marcado(s) como Ocupado`);
      }

      return turnoGuardado;
    } catch (error) {
      console.error('❌ ERROR creando turno:', error);
      throw error;
    }
  }

  // 🆕 NUEVO: Marcar turnos como guardados después de registrar jornada
  async marcarTurnosComoGuardados(turnoIds: string[]): Promise<void> {
    console.log('📝 Marcando turnos como guardados:', turnoIds.length);
    
    try {
      await this.turnosRepository.update(
        { id: In(turnoIds) },
        { estado_registro: EstadoRegistro.GUARDADO }
      );
      console.log('✅ Turnos marcados como guardados exitosamente');
    } catch (error) {
      console.error('❌ Error marcando turnos como guardados:', error);
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
    console.log('🔍 Club ID:', clubId);
    console.log('🔍 Estado de registro filtro:', EstadoRegistro.ACTIVO);
    
    const query = this.turnosRepository.createQueryBuilder('turno')
      .where('turno.club_id = :clubId', { clubId })
      // 🆕 FILTRO POR DEFECTO: Solo mostrar turnos ACTIVOS (no guardados)
      .andWhere('(turno.estado_registro = :estadoActivo OR turno.estado_registro IS NULL)', { estadoActivo: EstadoRegistro.ACTIVO });

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
    console.log('🔍 Turnos encontrados (con estado_registro):', turnos.map(t => ({ 
      id: t.id, 
      nombre: t.nombre, 
      estado_registro: t.estado_registro, 
      jornada_config_id: t.jornada_config_id 
    })));

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
        // 🆕 MAPEO: jornada_id para compatibilidad con frontend
        jornada_id: turno.jornada_config_id,
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

    // 🎯 AUTOMATIZACIÓN: Manejar cambios en personal asignado
    const personalAnterior = turno.personal_asignado || [];
    const personalNuevo = updateTurnoDto.personal_asignado || [];

    // Personal que se quitó del turno → volver a Disponible
    const personalRemovido = personalAnterior.filter(id => !personalNuevo.includes(id));
    if (personalRemovido.length > 0) {
      await this.cambiarEstadoPersonalAsignado(personalRemovido, 'Disponible', parseInt(clubId));
      console.log(`✅ ${personalRemovido.length} personal(es) liberado(s) - vuelto a Disponible`);
    }

    // Personal agregado al turno → marcar como Ocupado
    const personalAgregado = personalNuevo.filter(id => !personalAnterior.includes(id));
    if (personalAgregado.length > 0) {
      await this.cambiarEstadoPersonalAsignado(personalAgregado, 'Ocupado', parseInt(clubId));
      console.log(`✅ ${personalAgregado.length} personal(es) asignado(s) - marcado como Ocupado`);
    }

    Object.assign(turno, updateTurnoDto);
    return await this.turnosRepository.save(turno);
  }

  async remove(id: string, clubId: string): Promise<void> {
    const turno = await this.findOne(id, clubId);
    
    // 🎯 AUTOMATIZACIÓN: Liberar personal asignado al eliminar turno
    if (turno.personal_asignado && turno.personal_asignado.length > 0) {
      await this.cambiarEstadoPersonalAsignado(turno.personal_asignado, 'Disponible', parseInt(clubId));
      console.log(`✅ Turno eliminado - ${turno.personal_asignado.length} personal(es) liberado(s)`);
    }

    await this.turnosRepository.remove(turno);
  }

  async cambiarEstado(id: string, estado: string, clubId: string): Promise<Turno> {
    const turno = await this.findOne(id, clubId);
    
    // 🎯 AUTOMATIZACIÓN: Si el turno se completa, liberar personal asignado
    if (estado === 'completada' && turno.personal_asignado && turno.personal_asignado.length > 0) {
      await this.cambiarEstadoPersonalAsignado(turno.personal_asignado, 'Disponible', parseInt(clubId));
      console.log(`✅ Turno completado - ${turno.personal_asignado.length} personal(es) liberado(s)`);
    }

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

  /**
   * Método privado para cambiar el estado de múltiples personal
   * @param personalIds - Array de IDs del personal
   * @param nombreEstado - Nombre del estado (Disponible, Ocupado, etc.)
   * @param clubId - ID del club
   */
  private async cambiarEstadoPersonalAsignado(
    personalIds: string[],
    nombreEstado: string,
    clubId: number
  ): Promise<void> {
    try {
      // Cambiar estado de cada personal
      for (const personalId of personalIds) {
        await this.personalService.updateEstadoPorNombre(personalId, nombreEstado, clubId);
      }
    } catch (error) {
      console.error(`❌ Error cambiando estado del personal a ${nombreEstado}:`, error);
      // No lanzar error para no bloquear la creación/actualización del turno
    }
  }
}