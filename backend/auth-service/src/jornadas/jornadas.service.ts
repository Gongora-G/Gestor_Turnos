import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
    
    private dataSource: DataSource,
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

      // 2. Obtener TODAS las jornadas existentes de esta configuración
      let jornadasExistentes = await this.jornadasConfigRepository.find({
        where: { configuracionId: configuracion.id },
        order: { orden: 'ASC' }
      });
      
      this.logger.log(`🔄 Total jornadas existentes: ${jornadasExistentes.length}`);
      this.logger.log(`🔍 DETALLE DE JORNADAS EN BD:`);
      jornadasExistentes.forEach(j => {
        this.logger.log(`   - ID: ${j.id}, Código: ${j.codigo}, Nombre: ${j.nombre}, ConfigID: ${j.configuracionId}`);
      });

      // 3. IMPORTANTE: Si hay más jornadas existentes que las enviadas, eliminar duplicados
      if (jornadasExistentes.length > dto.jornadas.length) {
        this.logger.log(`⚠️ HAY DUPLICADOS! Limpiando ${jornadasExistentes.length - dto.jornadas.length} jornadas extras`);
        
        // Agrupar por código y mantener solo la primera de cada una
        const jornadasPorCodigo = new Map<string, JornadaConfig[]>();
        for (const jornada of jornadasExistentes) {
          if (!jornadasPorCodigo.has(jornada.codigo)) {
            jornadasPorCodigo.set(jornada.codigo, []);
          }
          jornadasPorCodigo.get(jornada.codigo)!.push(jornada);
        }
        
        // Eliminar duplicados de cada código (mantener solo la primera)
        const jornadasAMantener: JornadaConfig[] = [];
        for (const [codigo, jornadas] of jornadasPorCodigo) {
          // Siempre mantener la primera
          jornadasAMantener.push(jornadas[0]);
          
          // Eliminar el resto si hay duplicados
          if (jornadas.length > 1) {
            this.logger.log(`🗑️ Código ${codigo} tiene ${jornadas.length} duplicados, eliminando ${jornadas.length - 1}`);
            for (let i = 1; i < jornadas.length; i++) {
              try {
                await this.jornadasConfigRepository.delete(jornadas[i].id);
                this.logger.log(`✅ Duplicado ${codigo} (ID: ${jornadas[i].id}) eliminado`);
              } catch (error) {
                this.logger.warn(`⚠️ No se pudo eliminar duplicado ${codigo}: ${error.message}`);
              }
            }
          }
        }
        
        // Actualizar el array con solo las jornadas que quedaron (SIN recargar de BD)
        jornadasExistentes = jornadasAMantener;
        this.logger.log(`✅ Jornadas después de limpieza: ${jornadasExistentes.length} (${jornadasAMantener.map(j => j.codigo).join(', ')})`);
      }

      // 4. SOLO ACTUALIZAR las jornadas existentes (NUNCA crear nuevas si ya existen)
      const jornadasProcesadas: JornadaConfig[] = [];
      
      for (let i = 0; i < dto.jornadas.length; i++) {
        const jornadaData = dto.jornadas[i];
        const codigo = jornadaData.codigo || `J${i + 1}`;
        const horaInicio = this.normalizarHora(jornadaData.horaInicio);
        const horaFin = this.normalizarHora(jornadaData.horaFin);

        // BUSCAR DIRECTAMENTE EN LA BASE DE DATOS (no en el array en memoria)
        let jornadaExistente = await this.jornadasConfigRepository.findOne({
          where: { 
            configuracionId: configuracion.id,
            codigo: codigo 
          }
        });

        this.logger.log(`🔎 Procesando jornada enviada: Código=${codigo}, Nombre=${jornadaData.nombre}`);
        this.logger.log(`🔎 Buscando en BD configuracionId=${configuracion.id}, codigo=${codigo}...`);
        
        if (jornadaExistente) {
          // SOLO ACTUALIZAR - NUNCA CREAR
          this.logger.log(`✅ ENCONTRADA! Actualizando jornada ID ${jornadaExistente.id} - Código: ${codigo}`);
          jornadaExistente.nombre = jornadaData.nombre;
          jornadaExistente.descripcion = jornadaData.descripcion || '';
          jornadaExistente.horaInicio = horaInicio;
          jornadaExistente.horaFin = horaFin;
          jornadaExistente.color = jornadaData.color || '#3b82f6';
          jornadaExistente.orden = jornadaData.orden || (i + 1);
          jornadaExistente.activa = jornadaData.activa !== false;
          
          const jornadaGuardada = await this.jornadasConfigRepository.save(jornadaExistente);
          jornadasProcesadas.push(jornadaGuardada);
          this.logger.log(`✅ Jornada ${codigo} actualizada correctamente con ID ${jornadaGuardada.id}`);
        } else {
          // Solo crear si realmente no existe ninguna con ese código
          this.logger.error(`❌ NO ENCONTRADA! CREANDO NUEVA jornada: ${codigo} - ESTO NO DEBERÍA PASAR!`);
          this.logger.error(`❌ Códigos disponibles en jornadasExistentes: ${jornadasExistentes.map(j => j.codigo).join(', ')}`);
          
          const nuevaJornada = this.jornadasConfigRepository.create({
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

          const jornadaGuardada = await this.jornadasConfigRepository.save(nuevaJornada);
          jornadasProcesadas.push(jornadaGuardada);
          this.logger.error(`❌ Jornada ${codigo} CREADA NUEVA con ID: ${jornadaGuardada.id}`);
        }
      }

      this.logger.log('🎉 Configuración completa guardada exitosamente');

      // Devolver un objeto simple sin relaciones complejas
      return {
        id: configuracion.id,
        nombre: configuracion.nombre,
        descripcion: configuracion.descripcion,
        esquemaTipo: configuracion.esquemaTipo,
        esquema_tipo: configuracion.esquemaTipo,
        activa: configuracion.activa,
        jornadas: jornadasProcesadas.map(j => ({
          id: j.id,
          codigo: j.codigo,
          nombre: j.nombre,
          horaInicio: j.horaInicio,
          horaFin: j.horaFin,
          color: j.color,
          orden: j.orden,
          activa: j.activa
        }))
      };
    } catch (error) {
      this.logger.error('❌ Error al crear configuración completa:', error);
      this.logger.error('❌ Stack trace:', error.stack);
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
    let jornadas = await this.jornadasConfigRepository.find({
      where: { configuracionId: id },
      order: { orden: 'ASC' }
    });

    this.logger.log(`📊 GET - Total jornadas encontradas: ${jornadas.length}`);

    // 🎯 FILTRAR DUPLICADOS: Si hay múltiples jornadas con el mismo código, devolver solo la primera
    if (jornadas.length > 3) {
      const jornadasUnicas = new Map<string, JornadaConfig>();
      for (const jornada of jornadas) {
        if (!jornadasUnicas.has(jornada.codigo)) {
          jornadasUnicas.set(jornada.codigo, jornada);
        }
      }
      jornadas = Array.from(jornadasUnicas.values());
      this.logger.log(`✅ GET - Jornadas filtradas (sin duplicados): ${jornadas.length}`);
    }

    return {
      ...configuracion,
      esquema_tipo: configuracion.esquemaTipo, // Añadir alias snake_case
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

    let jornadas = await this.jornadasConfigRepository.find({
      where: { configuracionId: configuracion.id },
      order: { orden: 'ASC' }
    });

    this.logger.log(`📊 GET ACTIVA - Total jornadas encontradas: ${jornadas.length}`);

    // 🎯 FILTRAR DUPLICADOS: Si hay múltiples jornadas con el mismo código, devolver solo la primera
    if (jornadas.length > 3) {
      const jornadasUnicas = new Map<string, JornadaConfig>();
      for (const jornada of jornadas) {
        if (!jornadasUnicas.has(jornada.codigo)) {
          jornadasUnicas.set(jornada.codigo, jornada);
        }
      }
      jornadas = Array.from(jornadasUnicas.values());
      this.logger.log(`✅ GET ACTIVA - Jornadas filtradas (sin duplicados): ${jornadas.length}`);
    }

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

    // 🔒 FILTRAR: No mostrar registros eliminados
    query.andWhere('(registro.eliminado = :eliminado OR registro.eliminado IS NULL)', { eliminado: false });

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

    // Para cada registro, obtener los turnos asociados con información de canchas
    const registrosConTurnos = await Promise.all(
      registros.map(async (registro) => {
        console.log(`📋 DEBUG Procesando registro:`, {
          id: registro.id,
          fecha: registro.fecha,
          jornadaConfigId: registro.jornadaConfigId
        });

        // Obtener turnos de esta fecha y jornada_config_id
        const turnos = await this.dataSource.query(`
          SELECT 
            t.id,
            t.fecha,
            t.hora_inicio as "horaInicio",
            t.hora_fin as "horaFin",
            t.estado,
            t.nombre as "clienteNombre",
            t.observaciones as "notas",
            t.cancha_id as "canchaId",
            c.nombre as "nombreCancha"
          FROM auth.turnos t
          LEFT JOIN auth.canchas c ON t.cancha_id = c.id
          WHERE t.fecha = $1 AND t.jornada_config_id = $2
          ORDER BY t.hora_inicio ASC
        `, [registro.fecha, registro.jornadaConfigId]);

        console.log(`🎾 DEBUG Turnos encontrados para registro ${registro.id}:`, turnos.length);
        turnos.forEach((turno, index) => {
          console.log(`  Turno ${index + 1}:`, {
            id: turno.id,
            cancha: turno.nombreCancha,
            cliente: turno.clienteNombre,
            horario: `${turno.horaInicio} - ${turno.horaFin}`
          });
        });

        return {
          ...registro,
          turnosRegistrados: turnos || []
        };
      })
    );

    return registrosConTurnos;
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
        // Transformar la estructura para que coincida con el frontend
        return {
          ...jornada,
          horario: {
            horaInicio: jornada.horaInicio,
            horaFin: jornada.horaFin
          }
        } as any;
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
      this.logger.log(`🔍 DEBUG - getJornadasConfiguradas para club: ${clubId}`);
      
      // Obtener la configuración activa del club
      const configuracion = await this.configuracionRepository.findOne({
        where: { clubId, activa: true }
      });

      if (!configuracion) {
        this.logger.warn(`No hay configuración activa para el club ${clubId}`);
        return [];
      }

      // Obtener TODAS las jornadas de la configuración activa (tengan o no registros)
      let jornadas = await this.jornadasConfigRepository.find({
        where: { 
          configuracionId: configuracion.id,
          activa: true 
        },
        order: { orden: 'ASC' }
      });

      // Filtrar duplicados por código (devolver solo la primera de cada código)
      if (jornadas.length > 3) {
        const jornadasUnicas = new Map<string, JornadaConfig>();
        for (const jornada of jornadas) {
          if (!jornadasUnicas.has(jornada.codigo)) {
            jornadasUnicas.set(jornada.codigo, jornada);
          }
        }
        jornadas = Array.from(jornadasUnicas.values());
      }
      
      this.logger.log(`✅ Encontradas ${jornadas.length} jornadas CONFIGURADAS para el club ${clubId}`);
      this.logger.log(`🔍 DEBUG - Jornadas:`, jornadas.map(j => ({ id: j.id, codigo: j.codigo, nombre: j.nombre })));
      
      // Transformar la estructura para que coincida con el frontend (horario anidado)
      return jornadas.map(j => ({
        ...j,
        horario: {
          horaInicio: j.horaInicio,
          horaFin: j.horaFin
        }
      })) as any;
    } catch (error) {
      this.logger.error('❌ Error al obtener jornadas configuradas:', error);
      
      // Fallback al método original
      try {
        const configuracion = await this.configuracionRepository.findOne({
          where: { clubId, activa: true }
        });

        if (!configuracion) {
          this.logger.warn(`No hay configuración activa para el club ${clubId}`);
          return [];
        }

        const jornadas = await this.jornadasConfigRepository.find({
          where: { configuracionId: configuracion.id },
          order: { orden: 'ASC' }
        });

        this.logger.log(`✅ FALLBACK - Encontradas ${jornadas.length} jornadas configuradas`);
        
        // Transformar la estructura para que coincida con el frontend (horario anidado)
        return jornadas.map(j => ({
          ...j,
          horario: {
            horaInicio: j.horaInicio,
            horaFin: j.horaFin
          }
        })) as any;
      } catch (fallbackError) {
        this.logger.error('❌ Error en fallback:', fallbackError);
        throw error;
      }
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

      // Consultar registros de jornadas (no diarios) que tienen estadisticas
      const registrosDiarios = await this.registrosJornadaRepository
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
        // Sumar turnos del registro (desde el campo estadisticas)
        const turnosDelRegistro = registro.estadisticas?.totalTurnos || 0;
        const completadosDelRegistro = registro.estadisticas?.turnosCompletados || 0;
        
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

  // ==========================================
  // 🗑️ SOFT DELETE Y PAPELERA
  // ==========================================

  /**
   * Eliminar (soft delete) un registro de jornada
   */
  async eliminarRegistroDiario(id: string, userId: string): Promise<{ mensaje: string }> {
    try {
      this.logger.log(`🔍 Buscando registro con ID: ${id}`);
      this.logger.log(`🔍 Tipo de ID recibido: ${typeof id}`);
      
      const registro = await this.registrosJornadaRepository.findOne({ 
        where: { id } 
      });

      this.logger.log(`🔍 Registro encontrado:`, registro);

      if (!registro) {
        this.logger.error(`❌ Registro con ID ${id} NO encontrado en la base de datos`);
        throw new NotFoundException(`Registro con ID ${id} no encontrado`);
      }

      if (registro.eliminado) {
        throw new BadRequestException('Este registro ya está en la papelera');
      }

      // Soft delete
      registro.eliminado = true;
      registro.fechaEliminacion = new Date();
      registro.eliminadoPor = userId;

      await this.registrosJornadaRepository.save(registro);

      this.logger.log(`🗑️ Registro ${id} movido a papelera por usuario ${userId}`);
      
      return { 
        mensaje: 'Registro movido a la papelera. Se eliminará permanentemente en 30 días.' 
      };
    } catch (error) {
      this.logger.error('❌ Error al eliminar registro:', error);
      throw error;
    }
  }

  /**
   * Restaurar un registro de jornada desde la papelera
   */
  async restaurarRegistroDiario(id: string): Promise<RegistroJornada> {
    try {
      const registro = await this.registrosJornadaRepository.findOne({ 
        where: { id } 
      });

      if (!registro) {
        throw new NotFoundException(`Registro con ID ${id} no encontrado`);
      }

      if (!registro.eliminado) {
        throw new BadRequestException('Este registro no está en la papelera');
      }

      // Restaurar
      registro.eliminado = false;
      registro.fechaEliminacion = null as any;
      registro.eliminadoPor = null as any;

      const registroRestaurado = await this.registrosJornadaRepository.save(registro);

      this.logger.log(`♻️ Registro ${id} restaurado desde la papelera`);
      
      return registroRestaurado;
    } catch (error) {
      this.logger.error('❌ Error al restaurar registro:', error);
      throw error;
    }
  }

  /**
   * Obtener registros en la papelera
   */
  async obtenerPapelera(): Promise<RegistroJornada[]> {
    try {
      const registrosEliminados = await this.registrosJornadaRepository.find({
        where: { eliminado: true },
        order: { fechaEliminacion: 'DESC' }
      });

      this.logger.log(`📋 Se encontraron ${registrosEliminados.length} registros en la papelera`);
      
      return registrosEliminados;
    } catch (error) {
      this.logger.error('❌ Error al obtener papelera:', error);
      throw error;
    }
  }

  /**
   * Eliminar permanentemente un registro (hard delete)
   */
  async eliminarPermanentemente(id: string): Promise<{ mensaje: string }> {
    try {
      const registro = await this.registrosJornadaRepository.findOne({ 
        where: { id } 
      });

      if (!registro) {
        throw new NotFoundException(`Registro con ID ${id} no encontrado`);
      }

      // Eliminar el registro
      await this.registrosJornadaRepository.remove(registro);

      this.logger.log(`💥 Registro ${id} eliminado PERMANENTEMENTE`);
      
      return { 
        mensaje: 'Registro eliminado permanentemente' 
      };
    } catch (error) {
      this.logger.error('❌ Error al eliminar permanentemente:', error);
      throw error;
    }
  }

  /**
   * Limpiar registros antiguos de la papelera (más de 30 días)
   * Este método debe ser llamado por un cron job
   */
  async limpiarPapeleraAutomaticamente(): Promise<{ eliminados: number }> {
    try {
      const hace30Dias = new Date();
      hace30Dias.setDate(hace30Dias.getDate() - 30);

      const registrosAntiguos = await this.registrosJornadaRepository
        .createQueryBuilder('registro')
        .where('registro.eliminado = :eliminado', { eliminado: true })
        .andWhere('registro.fechaEliminacion < :fecha', { fecha: hace30Dias })
        .getMany();

      let contador = 0;
      for (const registro of registrosAntiguos) {
        // Eliminar registro
        await this.registrosJornadaRepository.remove(registro);
        contador++;
      }

      this.logger.log(`🧹 Limpieza automática: ${contador} registros eliminados permanentemente`);
      
      return { eliminados: contador };
    } catch (error) {
      this.logger.error('❌ Error en limpieza automática de papelera:', error);
      throw error;
    }
  }

  /**
   * Vaciar completamente la papelera
   */
  async vaciarPapelera(): Promise<{ mensaje: string; eliminados: number }> {
    try {
      const registrosEliminados = await this.registrosJornadaRepository.find({
        where: { eliminado: true }
      });

      let contador = 0;
      for (const registro of registrosEliminados) {
        // Eliminar registro
        await this.registrosJornadaRepository.remove(registro);
        contador++;
      }

      this.logger.log(`🗑️💥 Papelera vaciada: ${contador} registros eliminados permanentemente`);
      
      return { 
        mensaje: 'Papelera vaciada completamente',
        eliminados: contador
      };
    } catch (error) {
      this.logger.error('❌ Error al vaciar papelera:', error);
      throw error;
    }
  }
}
