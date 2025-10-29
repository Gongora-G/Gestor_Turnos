import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 
  ConfiguracionJornadas, 
  JornadaConfig,
  RegistroJornadaDiaria,
  RegistroJornadaDetalle
} from './entities/jornada.entity';
import { 
  CreateJornadaConfigDto, 
  UpdateJornadaConfigDto, 
  ConfiguracionJornadasDto,
  ConfiguracionJornadasCompletaDto,
  JornadaConfigSimpleDto
} from './dto/jornadas.dto';

@Injectable()
export class JornadasService {
  private readonly logger = new Logger(JornadasService.name);

  constructor(
    @InjectRepository(ConfiguracionJornadas)
    private configuracionRepository: Repository<ConfiguracionJornadas>,
    
    @InjectRepository(JornadaConfig)
    private jornadasConfigRepository: Repository<JornadaConfig>,
    
    @InjectRepository(RegistroJornadaDiaria)
    private registrosDiariosRepository: Repository<RegistroJornadaDiaria>,
    
    @InjectRepository(RegistroJornadaDetalle)
    private registrosDetalleRepository: Repository<RegistroJornadaDetalle>,
  ) {}

  // ==========================================
  // CONFIGURACION COMPLETA DE JORNADAS
  // ==========================================
  async createConfiguracionCompleta(clubId: string, userId: string, dto: ConfiguracionJornadasCompletaDto) {
    try {
      this.logger.log('🔍 Datos recibidos para crear configuración completa:', JSON.stringify(dto, null, 2));
      this.logger.log('🔍 Club ID:', clubId, 'User ID:', userId);

      // 1. Crear o actualizar la configuración general
      let configuracion = await this.configuracionRepository.findOne({
        where: { clubId, activa: true }
      });

      if (!configuracion) {
        configuracion = this.configuracionRepository.create({
          nombre: dto.nombre,
          descripcion: dto.descripcion,
          esquemaTipo: dto.esquema_tipo,
          activa: true,
          clubId,
          configuradoPor: userId,
          rotacionAutomatica: true,
        });
        configuracion = await this.configuracionRepository.save(configuracion);
        this.logger.log(`✅ Configuración creada con ID: ${configuracion.id}`);
      } else {
        configuracion.nombre = dto.nombre;
        if (dto.descripcion) configuracion.descripcion = dto.descripcion;
        configuracion.esquemaTipo = dto.esquema_tipo;
        configuracion = await this.configuracionRepository.save(configuracion);
        this.logger.log(`✅ Configuración actualizada ID: ${configuracion.id}`);
      }

      // 2. Eliminar jornadas existentes de esta configuración
      const jornadasExistentes = await this.jornadasConfigRepository.find({
        where: { configuracionId: configuracion.id }
      });
      
      if (jornadasExistentes.length > 0) {
        this.logger.log(`🗑️ Eliminando ${jornadasExistentes.length} jornadas existentes`);
        await this.jornadasConfigRepository.remove(jornadasExistentes);
      }

      // 3. Crear las nuevas jornadas
      const jornadasCreadas: JornadaConfig[] = [];
      
      for (let i = 0; i < dto.jornadas.length; i++) {
        const jornadaData = dto.jornadas[i];
        this.logger.log(`📝 Creando jornada ${i + 1}:`, jornadaData.nombre);

        // Generar código si no viene
        const codigo = jornadaData.codigo || `J${i + 1}`;

        // Normalizar formato de hora (agregar segundos si no los tiene)
        const horaInicio = this.normalizarHora(jornadaData.horaInicio);
        const horaFin = this.normalizarHora(jornadaData.horaFin);

        const jornada = this.jornadasConfigRepository.create({
          configuracionId: configuracion.id,
          codigo,
          nombre: jornadaData.nombre,
          descripcion: jornadaData.descripcion,
          horaInicio,
          horaFin,
          color: jornadaData.color || '#3b82f6',
          orden: jornadaData.orden || (i + 1),
          activa: jornadaData.activa !== false,
          clubId,
          configuradoPor: userId,
        });

        const jornadaGuardada = await this.jornadasConfigRepository.save(jornada);
        jornadasCreadas.push(jornadaGuardada);
        this.logger.log(`✅ Jornada ${i + 1} creada con ID:`, jornadaGuardada.id);
      }

      this.logger.log('🎉 Configuración completa creada exitosamente');

      return {
        configuracion: await this.getConfiguracionById(configuracion.id),
        jornadas: jornadasCreadas,
      };
    } catch (error) {
      this.logger.error('❌ Error al crear configuración completa:', error);
      throw error;
    }
  }

  async updateConfiguracionCompleta(clubId: string, userId: string, dto: ConfiguracionJornadasCompletaDto) {
    this.logger.log('🔄 Actualizando configuración completa para club:', clubId);
    return await this.createConfiguracionCompleta(clubId, userId, dto);
  }

  // ==========================================
  // CRUD CONFIGURACION JORNADAS
  // ==========================================
  async getConfiguracionById(id: number) {
    const configuracion = await this.configuracionRepository.findOne({
      where: { id }
    });

    if (!configuracion) {
      throw new NotFoundException('Configuración no encontrada');
    }

    // Cargar jornadas asociadas
    const jornadas = await this.jornadasConfigRepository.find({
      where: { configuracionId: id },
      order: { orden: 'ASC' }
    });

    return {
      ...configuracion,
      jornadas,
    };
  }

  async getConfiguracionActiva(clubId: string) {
    this.logger.log(`📡 getConfiguracionActiva - Buscando para clubId: ${clubId}`);
    
    // Buscar primero CON filtro de club
    let configuracion = await this.configuracionRepository.findOne({
      where: { clubId, activa: true }
    });

    // Si no encuentra, buscar cualquier configuración activa (para debug)
    if (!configuracion) {
      this.logger.warn(`⚠️ No se encontró configuración activa para club ${clubId}, buscando sin filtro...`);
      configuracion = await this.configuracionRepository.findOne({
        where: { activa: true },
        order: { id: 'DESC' }
      });
    }

    if (!configuracion) {
      this.logger.warn('⚠️ No se encontró ninguna configuración activa');
      return null;
    }

    this.logger.log(`✅ Configuración encontrada: ID=${configuracion.id}, nombre=${configuracion.nombre}`);

    const jornadas = await this.jornadasConfigRepository.find({
      where: { configuracionId: configuracion.id },
      order: { orden: 'ASC' }
    });

    this.logger.log(`✅ Jornadas encontradas: ${jornadas.length}`);

    return {
      ...configuracion,
      jornadas,
    };
  }

  async getConfiguracionesByClub(clubId: string) {
    return await this.configuracionRepository.find({
      where: { clubId },
      order: { createdAt: 'DESC' }
    });
  }

  // ==========================================
  // CRUD JORNADA CONFIG
  // ==========================================
  async createJornadaConfig(dto: CreateJornadaConfigDto, userId: string) {
    // Validar que la configuración existe
    const configuracion = await this.configuracionRepository.findOne({
      where: { id: dto.configuracionId }
    });

    if (!configuracion) {
      throw new NotFoundException('Configuración no encontrada');
    }

    // Validar código único en la configuración
    const existeCodigo = await this.jornadasConfigRepository.findOne({
      where: { 
        configuracionId: dto.configuracionId,
        codigo: dto.codigo 
      }
    });

    if (existeCodigo) {
      throw new ConflictException(`Ya existe una jornada con código ${dto.codigo} en esta configuración`);
    }

    // Normalizar horas
    const horaInicio = this.normalizarHora(dto.horaInicio);
    const horaFin = this.normalizarHora(dto.horaFin);

    // Validar horarios
    if (horaInicio >= horaFin) {
      throw new BadRequestException('La hora de inicio debe ser menor que la hora de fin');
    }

    const jornada = this.jornadasConfigRepository.create({
      ...dto,
      horaInicio,
      horaFin,
      configuradoPor: userId,
    });

    return await this.jornadasConfigRepository.save(jornada);
  }

  async getJornadasByConfiguracion(configuracionId: number) {
    return await this.jornadasConfigRepository.find({
      where: { configuracionId },
      order: { orden: 'ASC' }
    });
  }

  async getJornadaById(id: number) {
    const jornada = await this.jornadasConfigRepository.findOne({
      where: { id }
    });

    if (!jornada) {
      throw new NotFoundException('Jornada no encontrada');
    }

    return jornada;
  }

  async updateJornadaConfig(id: number, dto: UpdateJornadaConfigDto) {
    const jornada = await this.getJornadaById(id);

    // Si se cambia el código, validar que no existe
    if (dto.codigo && dto.codigo !== jornada.codigo) {
      const existeCodigo = await this.jornadasConfigRepository.findOne({
        where: { 
          configuracionId: jornada.configuracionId,
          codigo: dto.codigo 
        }
      });

      if (existeCodigo) {
        throw new ConflictException(`Ya existe una jornada con código ${dto.codigo}`);
      }
    }

    // Normalizar horas si se proporcionan
    if (dto.horaInicio) {
      dto.horaInicio = this.normalizarHora(dto.horaInicio);
    }
    if (dto.horaFin) {
      dto.horaFin = this.normalizarHora(dto.horaFin);
    }

    // Validar horarios
    const horaInicio = dto.horaInicio || jornada.horaInicio;
    const horaFin = dto.horaFin || jornada.horaFin;
    
    if (horaInicio >= horaFin) {
      throw new BadRequestException('La hora de inicio debe ser menor que la hora de fin');
    }

    Object.assign(jornada, dto);
    return await this.jornadasConfigRepository.save(jornada);
  }

  async deleteJornadaConfig(id: number) {
    const jornada = await this.getJornadaById(id);
    await this.jornadasConfigRepository.remove(jornada);
    return { message: 'Jornada eliminada correctamente' };
  }

  // ==========================================
  // MÉTODOS AUXILIARES
  // ==========================================
  private normalizarHora(hora: string): string {
    // Si la hora tiene formato HH:MM, agregar :00 para convertir a HH:MM:SS
    if (hora && hora.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      return `${hora}:00`;
    }
    return hora;
  }

  // ==========================================
  // REGISTRO DE JORNADAS DIARIAS
  // ==========================================
  async getOrCreateRegistroDiario(fecha: Date, configuracionId?: number) {
    const fechaStr = fecha.toISOString().split('T')[0];
    
    let registro = await this.registrosDiariosRepository.findOne({
      where: { fecha: fechaStr as any }
    });

    if (!registro) {
      registro = this.registrosDiariosRepository.create({
        fecha: fechaStr as any,
        configuracionId,
        estado: 'activa',
        totalTurnos: 0,
        totalCompletados: 0,
      });
      registro = await this.registrosDiariosRepository.save(registro);
    }

    return registro;
  }

  async getRegistrosDiarios(fechaInicio?: Date, fechaFin?: Date) {
    const query = this.registrosDiariosRepository.createQueryBuilder('registro');

    if (fechaInicio) {
      query.andWhere('registro.fecha >= :fechaInicio', { 
        fechaInicio: fechaInicio.toISOString().split('T')[0] 
      });
    }

    if (fechaFin) {
      query.andWhere('registro.fecha <= :fechaFin', { 
        fechaFin: fechaFin.toISOString().split('T')[0] 
      });
    }

    return await query
      .orderBy('registro.fecha', 'DESC')
      .getMany();
  }

  async determinarJornadaActualPorHora(clubId: string) {
    const configuracion = await this.configuracionRepository.findOne({
      where: { clubId, activa: true }
    });

    if (!configuracion) {
      this.logger.warn(`No hay configuración activa para el club ${clubId}`);
      return null;
    }

    const jornadas = await this.jornadasConfigRepository.find({
      where: { configuracionId: configuracion.id, activa: true },
      order: { orden: 'ASC' }
    });

    if (!jornadas.length) {
      this.logger.warn(`No hay jornadas configuradas`);
      return null;
    }

    const ahora = new Date();
    const horaActual = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}:00`;
    
    this.logger.log(`Determinando jornada actual. Hora: ${horaActual}`);

    for (const jornada of jornadas) {
      const inicio = jornada.horaInicio;
      const fin = jornada.horaFin;
      
      // 🌙 Detectar si la jornada cruza la medianoche (ej: 20:00 - 04:00)
      const cruzaMedianoche = inicio > fin;
      
      let enRango = false;
      if (cruzaMedianoche) {
        // Si cruza medianoche: está en rango si >= inicio O <= fin
        enRango = horaActual >= inicio || horaActual <= fin;
      } else {
        // Si NO cruza medianoche: está en rango si >= inicio Y <= fin
        enRango = horaActual >= inicio && horaActual <= fin;
      }
      
      if (enRango) {
        this.logger.log(`✅ Jornada actual: ${jornada.nombre} (${inicio} - ${fin})`);
        return jornada;
      }
    }

    this.logger.warn(`No se encontró jornada para ${horaActual}`);
    return jornadas[0];
  }

  // 🎯 NUEVO: Determinar jornada basándose en una hora específica (hora del turno, no hora actual)
  async determinarJornadaPorHora(clubId: string, horaEspecifica: string) {
    const configuracion = await this.configuracionRepository.findOne({
      where: { clubId, activa: true }
    });

    if (!configuracion) {
      this.logger.warn(`No hay configuración activa para el club ${clubId}`);
      return null;
    }

    const jornadas = await this.jornadasConfigRepository.find({
      where: { configuracionId: configuracion.id, activa: true },
      order: { orden: 'ASC' }
    });

    if (!jornadas.length) {
      this.logger.warn(`No hay jornadas configuradas`);
      return null;
    }

    // Normalizar la hora a formato HH:MM:SS
    let horaNormalizada = horaEspecifica;
    if (horaEspecifica.length === 5) { // "HH:MM"
      horaNormalizada = `${horaEspecifica}:00`;
    }
    
    this.logger.log(`🔍 Buscando jornada para hora: ${horaNormalizada}`);

    for (const jornada of jornadas) {
      const inicio = jornada.horaInicio;
      const fin = jornada.horaFin;
      
      // 🌙 Detectar si la jornada cruza la medianoche (ej: 20:00 - 04:00)
      const cruzaMedianoche = inicio > fin;
      
      let enRango = false;
      if (cruzaMedianoche) {
        // Si cruza medianoche: está en rango si >= inicio O <= fin
        enRango = horaNormalizada >= inicio || horaNormalizada <= fin;
        this.logger.log(`  Jornada ${jornada.nombre} cruza medianoche: ${inicio} - ${fin}, hora: ${horaNormalizada}, en rango: ${enRango}`);
      } else {
        // Si NO cruza medianoche: está en rango si >= inicio Y <= fin
        enRango = horaNormalizada >= inicio && horaNormalizada <= fin;
        this.logger.log(`  Jornada ${jornada.nombre}: ${inicio} - ${fin}, hora: ${horaNormalizada}, en rango: ${enRango}`);
      }
      
      if (enRango) {
        this.logger.log(`✅ Jornada encontrada: ${jornada.nombre} (${inicio} - ${fin})`);
        return jornada;
      }
    }

    this.logger.warn(`⚠️ No se encontró jornada para ${horaNormalizada}, usando primera jornada como fallback`);
    return jornadas[0];
  }

  async guardarRegistroJornada(clubId: string, userId: string, data: any) {
    this.logger.log(`💾 Guardando registro de jornada`);
    const { jornadaConfigId, turnos, fecha } = data;

    const jornadaConfig = await this.jornadasConfigRepository.findOne({
      where: { id: jornadaConfigId }
    });

    if (!jornadaConfig) {
      throw new NotFoundException(`Jornada no encontrada`);
    }

    const fechaRegistro = fecha ? new Date(fecha) : new Date();
    const registroDiario = await this.getOrCreateRegistroDiario(fechaRegistro, jornadaConfig.configuracionId);

    let detalle = await this.registrosDetalleRepository.findOne({
      where: {
        registroDiarioId: registroDiario.id,
        jornadaConfigId: jornadaConfig.id
      }
    });

    if (!detalle) {
      detalle = this.registrosDetalleRepository.create({
        registroDiarioId: registroDiario.id,
        jornadaConfigId: jornadaConfig.id,
        totalTurnos: 0,
        turnosCompletados: 0,
        turnosEnProgreso: 0,
        duracionTotal: 0,
        canchasMasUsadas: []
      });
    }

    const turnosCompletados = turnos.filter((t: any) => t.estado === 'completado').length;
    const turnosEnProgreso = turnos.filter((t: any) => t.estado === 'en_progreso').length;
    const canchas = turnos.map((t: any) => t.cancha).filter((c: string) => c);
    const canchasContadas = canchas.reduce((acc: any, cancha: string) => {
      acc[cancha] = (acc[cancha] || 0) + 1;
      return acc;
    }, {});
    const canchasMasUsadas = Object.entries(canchasContadas)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 3)
      .map(([cancha]) => cancha);

    detalle.totalTurnos = turnos.length;
    detalle.turnosCompletados = turnosCompletados;
    detalle.turnosEnProgreso = turnosEnProgreso;
    detalle.canchasMasUsadas = canchasMasUsadas;

    await this.registrosDetalleRepository.save(detalle);

    registroDiario.totalTurnos += turnos.length;
    registroDiario.totalCompletados += turnosCompletados;
    await this.registrosDiariosRepository.save(registroDiario);

    const siguienteJornada = await this.obtenerSiguienteJornada(jornadaConfig);

    this.logger.log(`✅ Registro guardado`);

    return {
      mensaje: 'Jornada guardada exitosamente',
      registroDiarioId: registroDiario.id,
      detalleId: detalle.id,
      totalTurnos: turnos.length,
      turnosCompletados,
      siguienteJornada: siguienteJornada ? {
        id: siguienteJornada.id,
        codigo: siguienteJornada.codigo,
        nombre: siguienteJornada.nombre,
        horaInicio: siguienteJornada.horaInicio,
        horaFin: siguienteJornada.horaFin
      } : null
    };
  }

  async obtenerSiguienteJornada(jornadaActual: JornadaConfig) {
    const jornadas = await this.jornadasConfigRepository.find({
      where: { 
        configuracionId: jornadaActual.configuracionId,
        activa: true
      },
      order: { orden: 'ASC' }
    });

    const indexActual = jornadas.findIndex(j => j.id === jornadaActual.id);
    if (indexActual === -1) return null;

    const siguienteIndex = (indexActual + 1) % jornadas.length;
    return jornadas[siguienteIndex];
  }

  async activarSiguienteJornada(clubId: string) {
    const jornadaActual = await this.determinarJornadaActualPorHora(clubId);
    
    if (!jornadaActual) {
      throw new NotFoundException('No hay jornada activa');
    }

    const siguienteJornada = await this.obtenerSiguienteJornada(jornadaActual);
    
    return {
      jornadaAnterior: {
        id: jornadaActual.id,
        codigo: jornadaActual.codigo,
        nombre: jornadaActual.nombre
      },
      siguienteJornada: siguienteJornada ? {
        id: siguienteJornada.id,
        codigo: siguienteJornada.codigo,
        nombre: siguienteJornada.nombre,
        horaInicio: siguienteJornada.horaInicio,
        horaFin: siguienteJornada.horaFin,
        color: siguienteJornada.color
      } : null
    };
  }

  // 🔍 Método auxiliar para obtener jornadas por IDs
  async findJornadaConfigByIds(ids: number[]): Promise<JornadaConfig[]> {
    if (ids.length === 0) return [];
    
    return await this.jornadasConfigRepository
      .createQueryBuilder('jornada')
      .where('jornada.id IN (:...ids)', { ids })
      .getMany();
  }
}
