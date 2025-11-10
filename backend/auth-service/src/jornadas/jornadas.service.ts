import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 
  ConfiguracionJornadas, 
  JornadaConfig,
  RegistroJornadaDiaria,
  RegistroJornadaDetalle,
  RegistroJornada
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
    
    @InjectRepository(RegistroJornada)
    private registrosJornadaRepository: Repository<RegistroJornada>,
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
    
    let configuracion: any = null;
    
    // Si hay clubId, buscar por club específico
    if (clubId && clubId !== 'undefined' && clubId !== 'null') {
      configuracion = await this.configuracionRepository.findOne({
        where: { clubId, activa: true }
      });
      this.logger.log(`🔍 Configuración con clubId ${clubId}: ${configuracion ? 'ENCONTRADA' : 'NO ENCONTRADA'}`);
    }

    // Si no encuentra por clubId o no hay clubId, buscar cualquier configuración activa
    if (!configuracion) {
      this.logger.warn(`⚠️ Buscando configuración activa sin filtro de club...`);
      configuracion = await this.configuracionRepository.findOne({
        where: { activa: true },
        order: { id: 'DESC' }
      });
      this.logger.log(`🔍 Configuración sin filtro: ${configuracion ? 'ENCONTRADA ID: ' + configuracion.id : 'NO ENCONTRADA'}`);
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
    console.log('🔍 DEBUG getRegistrosDiarios - Consultando registros:', {
      fechaInicio: fechaInicio?.toISOString().split('T')[0],
      fechaFin: fechaFin?.toISOString().split('T')[0]
    });

    const query = this.registrosJornadaRepository.createQueryBuilder('registro');

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

    const registros = await query
      .orderBy('registro.fecha_creacion', 'DESC')
      .getMany();

    console.log('✅ DEBUG getRegistrosDiarios - Registros encontrados:', registros.length);
    registros.forEach((registro, index) => {
      console.log(`📋 DEBUG Registro ${index + 1}:`, {
        id: registro.id,
        fecha: registro.fecha,
        jornadaConfigId: registro.jornadaConfigId,
        estadisticas: registro.estadisticas,
        estado: registro.estado
      });
    });

    return registros;
  }

  async determinarJornadaActualPorHora(clubId: string) {
    this.logger.log(`🕐 determinarJornadaActualPorHora - clubId: ${clubId}`);
    
    // USAR EXACTAMENTE EL MISMO CRITERIO QUE getJornadasConfiguradas
    const configuracion = await this.configuracionRepository.findOne({
      where: { clubId, activa: true }
    });

    if (!configuracion) {
      this.logger.warn(`❌ No hay configuración activa para el club ${clubId}`);
      return null;
    }

    this.logger.log(`✅ Usando configuración ID: ${configuracion.id} - ${configuracion.nombre}`);

    const jornadas = await this.jornadasConfigRepository.find({
      where: { configuracionId: configuracion.id, activa: true },
      order: { orden: 'ASC' }
    });

    this.logger.log(`🔍 DEBUG - Jornadas encontradas para configuración ${configuracion.id}:`, 
      jornadas.map(j => ({ id: j.id, nombre: j.nombre, horaInicio: j.horaInicio, horaFin: j.horaFin }))
    );

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
        this.logger.log(`✅ Jornada actual: ${jornada.nombre} (${inicio} - ${fin}) - ID: ${jornada.id}`);
        this.logger.log(`🔍 DEBUG - Jornada retornada completa:`, {
          id: jornada.id,
          nombre: jornada.nombre,
          codigo: jornada.codigo,
          configuracionId: jornada.configuracionId
        });
        return jornada;
      }
    }

    this.logger.warn(`❌ No se encontró jornada activa para ${horaActual}`);
    return null;
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
    try {
      this.logger.log(`💾 Guardando registro de jornada para club: ${clubId}, usuario: ${userId}`);
      this.logger.log(`📋 Datos recibidos:`, JSON.stringify(data, null, 2));
      
      const { jornadaConfigId, turnos, fecha } = data;

      // Validar datos de entrada
      if (!jornadaConfigId) {
        throw new BadRequestException('jornadaConfigId es requerido');
      }
      if (!turnos || !Array.isArray(turnos) || turnos.length === 0) {
        throw new BadRequestException('turnos es requerido y debe ser un array con al menos un elemento');
      }

      // Buscar jornada config
      const jornadaConfig = await this.jornadasConfigRepository.findOne({
        where: { id: jornadaConfigId }
      });

      if (!jornadaConfig) {
        throw new NotFoundException(`Jornada con ID ${jornadaConfigId} no encontrada`);
      }

      this.logger.log(`✅ Jornada encontrada: ${jornadaConfig.nombre}`);

      // Preparar fecha
      const fechaRegistro = fecha ? new Date(fecha) : new Date();
      const fechaStr = fechaRegistro.toISOString().split('T')[0];

      this.logger.log(`📅 Fecha de registro: ${fechaStr}`);

      // Procesar turnos y calcular estadísticas
      const turnosCompletados = turnos.filter((t: any) => 
        t.estado === 'completado' || t.estado === 'completada'
      ).length;
      
      const turnosEnProgreso = turnos.filter((t: any) => 
        t.estado === 'en_progreso' || t.estado === 'activo'
      ).length;

      // Calcular canchas más usadas
      const canchas = turnos
        .map((t: any) => t.numeroCancha || t.cancha || '1')
        .filter((c: any) => c);
        
      const canchasContadas = canchas.reduce((acc: any, cancha: any) => {
        const canchaStr = cancha.toString();
        acc[canchaStr] = (acc[canchaStr] || 0) + 1;
        return acc;
      }, {});

      const canchasMasUsadas = Object.entries(canchasContadas)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 3)
        .map(([cancha]) => cancha);

      this.logger.log(`📊 Estadísticas: ${turnos.length} turnos, ${turnosCompletados} completados, ${turnosEnProgreso} en progreso`);
      this.logger.log(`🏟️ Canchas más usadas:`, canchasMasUsadas);

      // **CREAR REGISTRO DIRECTO EN LA TABLA PRINCIPAL**
      const registroJornada = this.registrosJornadaRepository.create({
        clubId,
        jornadaConfigId: jornadaConfig.id, // Usar el ID de la jornada encontrada (como número)
        fecha: fechaStr as any, // TypeORM maneja la conversión de fecha
        horaInicio: jornadaConfig.horaInicio,
        horaFin: jornadaConfig.horaFin,
        turnosRegistrados: turnos, // Guardar todos los turnos como JSON
        estadisticas: {
          totalTurnos: turnos.length,
          turnosCompletados,
          turnosEnProgreso,
          canchasMasUsadas,
          fechaCreacion: new Date().toISOString()
        },
        estado: 'completada',
        observaciones: `Jornada ${jornadaConfig.nombre} guardada con ${turnos.length} turnos`,
        creadoPor: userId
      });

      console.log('🔍 DEBUG ANTES DE GUARDAR - Datos del registro:', {
        clubId,
        jornadaConfigId: jornadaConfig.id,
        fecha: fechaStr,
        totalTurnos: turnos.length,
        jornadaConfig: { id: jornadaConfig.id, nombre: jornadaConfig.nombre, codigo: jornadaConfig.codigo }
      });

      const registroGuardado = await this.registrosJornadaRepository.save(registroJornada);
      
      console.log('✅ DEBUG DESPUÉS DE GUARDAR - Registro guardado:', {
        id: registroGuardado.id,
        jornadaConfigId: registroGuardado.jornadaConfigId,
        fecha: registroGuardado.fecha,
        estadisticas: registroGuardado.estadisticas
      });

      this.logger.log(`✅ Registro guardado con ID: ${registroGuardado.id}`);

      // 🎯 OBTENER LA JORNADA ACTUAL BASADA EN LA HORA (no la siguiente automática)
      const jornadaActualPorHora = await this.determinarJornadaActualPorHora(clubId);
      this.logger.log(`🕐 Jornada actual basada en horario:`, jornadaActualPorHora?.nombre || 'Ninguna');

      // Respuesta compatible con el frontend
      return {
        registroDiario: {
          id: registroGuardado.id,
          fecha: registroGuardado.fecha,
          estadisticas: {
            totalTurnos: turnos.length,
            turnosCompletados,
            turnosEnProgreso
          }
        },
        siguienteJornada: jornadaActualPorHora ? {
          id: jornadaActualPorHora.id,
          codigo: jornadaActualPorHora.codigo,
          nombre: jornadaActualPorHora.nombre,
          horaInicio: jornadaActualPorHora.horaInicio,
          horaFin: jornadaActualPorHora.horaFin,
          color: jornadaActualPorHora.color
        } : null,
        mensaje: `Jornada guardada exitosamente. ${jornadaActualPorHora ? `Jornada actual: ${jornadaActualPorHora.nombre}` : 'No hay jornada activa en este horario'}`
      };

    } catch (error) {
      this.logger.error('❌ Error al guardar registro de jornada:', error);
      throw error;
    }
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

  // 🔍 Obtener todas las jornadas configuradas del sistema
  async getJornadasConfiguradas(clubId: string): Promise<JornadaConfig[]> {
    try {
      // Obtener la configuración activa del club
      const configuracion = await this.configuracionRepository.findOne({
        where: { clubId, activa: true }
      });

      if (!configuracion) {
        this.logger.warn(`No hay configuración activa para el club ${clubId}`);
        return [];
      }

      // Obtener todas las jornadas de la configuración activa
      const jornadas = await this.jornadasConfigRepository.find({
        where: { configuracionId: configuracion.id },
        order: { orden: 'ASC' }
      });

      this.logger.log(`✅ Encontradas ${jornadas.length} jornadas configuradas para el club ${clubId}`);
      this.logger.log(`🔍 DEBUG - IDs de jornadas devueltas:`, jornadas.map(j => ({ id: j.id, nombre: j.nombre, configuracionId: j.configuracionId })));
      return jornadas;
    } catch (error) {
      this.logger.error('❌ Error al obtener jornadas configuradas:', error);
      throw error;
    }
  }

  // 📊 Obtener estadísticas detalladas de una jornada
  async getEstadisticasJornada(jornadaConfigId: number, clubId: string, fechaInicio: string, fechaFin: string): Promise<any> {
    try {
      this.logger.log(`📊 Obteniendo estadísticas REALES para jornada ${jornadaConfigId} del ${fechaInicio} al ${fechaFin}`);

      // Verificar que la jornada pertenece al club
      const jornada = await this.jornadasConfigRepository.findOne({
        where: { id: jornadaConfigId }
      });

      if (!jornada) {
        throw new Error(`Jornada ${jornadaConfigId} no encontrada`);
      }

      // Primero, verificar qué registros hay en total
      const todosLosRegistros = await this.registrosDiariosRepository.find();
      this.logger.log(`🔍 TOTAL registros en BD: ${todosLosRegistros.length}`);
      todosLosRegistros.forEach(reg => {
        this.logger.log(`📋 Registro: ID=${reg.id}, fecha=${reg.fecha}, jornadaConfigId=${reg.jornadaConfigId}, turnos=${reg.total_turnos}`);
      });

      // Consultar registros diarios de esta jornada en el período especificado
      const registrosDiarios = await this.registrosDiariosRepository
        .createQueryBuilder('registro')
        .where('registro.jornadaConfigId = :jornadaConfigId', { jornadaConfigId })
        .andWhere('registro.fecha >= :fechaInicio', { fechaInicio })
        .andWhere('registro.fecha <= :fechaFin', { fechaFin })
        .getMany();

      this.logger.log(`📅 Encontrados ${registrosDiarios.length} registros para jornada ${jornada.codigo} (ID: ${jornadaConfigId})`);
      this.logger.log(`🔍 Parámetros consulta: jornadaConfigId=${jornadaConfigId}, fechaInicio=${fechaInicio}, fechaFin=${fechaFin}`);

      // Calcular estadísticas reales
      let totalTurnos = 0;
      let turnosCompletados = 0;
      let diasConActividad = registrosDiarios.length;

      for (const registro of registrosDiarios) {
        // Sumar turnos del registro
        const turnosDelRegistro = registro.total_turnos || 0;
        const completadosDelRegistro = registro.turnos_completados || 0;
        
        totalTurnos += turnosDelRegistro;
        turnosCompletados += completadosDelRegistro;

        this.logger.log(`📊 Registro ${registro.fecha}: ${turnosDelRegistro} turnos, ${completadosDelRegistro} completados`);
      }

      const turnosEnProgreso = totalTurnos - turnosCompletados;
      const promedioPorDia = diasConActividad > 0 ? Math.round(totalTurnos / diasConActividad * 100) / 100 : 0;
      const tasaCompletado = totalTurnos > 0 ? Math.round((turnosCompletados / totalTurnos) * 100) : 0;
      const tasaProgreso = totalTurnos > 0 ? Math.round((turnosEnProgreso / totalTurnos) * 100) : 0;

      // Calcular horas totales basado en la duración de la jornada
      let totalHoras = 0;
      if (jornada.horaInicio && jornada.horaFin) {
        const [inicioH, inicioM] = jornada.horaInicio.split(':').map(Number);
        const [finH, finM] = jornada.horaFin.split(':').map(Number);
        const duracionMinutos = (finH * 60 + finM) - (inicioH * 60 + inicioM);
        const duracionHoras = duracionMinutos / 60;
        totalHoras = Math.round(duracionHoras * diasConActividad * 100) / 100;
      }

      const promedioHorasPorDia = diasConActividad > 0 ? Math.round((totalHoras / diasConActividad) * 100) / 100 : 0;

      const estadisticas = {
        jornada: {
          id: jornada.id,
          codigo: jornada.codigo,
          nombre: jornada.nombre,
          horario: `${jornada.horaInicio} - ${jornada.horaFin}`,
          color: jornada.color
        },
        periodo: {
          fechaInicio,
          fechaFin,
          diasConActividad
        },
        turnos: {
          total: totalTurnos,
          completados: turnosCompletados,
          enProgreso: turnosEnProgreso,
          promedioPorDia
        },
        tiempo: {
          totalHoras,
          promedioHorasPorDia
        },
        eficiencia: {
          tasaCompletado,
          tasaProgreso
        }
      };

      this.logger.log(`✅ Estadísticas REALES calculadas para jornada ${jornada.nombre}:`, JSON.stringify(estadisticas, null, 2));
      return estadisticas;
    } catch (error) {
      this.logger.error('❌ Error al obtener estadísticas de jornada:', error);
      throw error;
    }
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
