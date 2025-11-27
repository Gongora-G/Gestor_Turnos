import { Injectable, NotFoundException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroAsistencia } from './entities/registro-asistencia.entity';
import { TareaAsignada } from './entities/tarea-asignada.entity';
import { RegistrarAsistenciaDto, ActualizarAsistenciaDto, ObtenerAsistenciaDto } from './dto/asistencia.dto';

@Injectable()
export class AsistenciaService {
  private readonly logger = new Logger(AsistenciaService.name);

  constructor(
    @InjectRepository(RegistroAsistencia)
    private readonly asistenciaRepository: Repository<RegistroAsistencia>,
    @InjectRepository(TareaAsignada)
    private readonly tareasAsignadasRepository: Repository<TareaAsignada>,
  ) {}

  /**
   * 📝 Registrar llegada de personal
   */
  async registrarLlegada(dto: RegistrarAsistenciaDto): Promise<RegistroAsistencia> {
    this.logger.log(`📝 Registrando llegada de personal ${dto.personalId} en jornada ${dto.jornadaConfigId}`);
    this.logger.log(`📝 DTO completo:`, JSON.stringify(dto, null, 2));

    // Parsear fecha en formato YYYY-MM-DD sin conversión de zona horaria
    // Tomar solo la parte de fecha si viene con hora (ISO 8601)
    const fechaSoloFecha = dto.fecha.split('T')[0]; // "2025-11-18"
    const [year, month, day] = fechaSoloFecha.split('-').map(Number);
    const fechaDate = new Date(year, month - 1, day); // Mes es 0-indexed

    // Verificar si ya existe registro para ese personal en esa fecha y jornada
    const registroExistente = await this.asistenciaRepository.findOne({
      where: {
        personalId: dto.personalId,
        jornadaConfigId: dto.jornadaConfigId,
        fecha: fechaDate,
        clubId: dto.clubId,
      },
    });

    if (registroExistente) {
      throw new HttpException(
        'Este personal ya tiene registrada su llegada para esta jornada hoy',
        HttpStatus.CONFLICT,
      );
    }

    // Crear registro con timestamp automático
    const registro = this.asistenciaRepository.create({
      ...dto,
      fecha: fechaDate, // Convertir string a Date
      horaLlegada: new Date(), // Timestamp automático
      presente: dto.presente ?? true, // Usar valor del DTO o true por defecto
      tareasCompletadas: dto.tareasCompletadas ?? false,
      turnosRealizadosAyer: dto.turnosRealizadosAyer ?? 0,
    });

    const registroGuardado = await this.asistenciaRepository.save(registro);

    // Cargar relaciones para devolver datos completos
    const registroCompleto = await this.asistenciaRepository.findOne({
      where: { id: registroGuardado.id },
      relations: ['personal', 'personal.tipoPersonal', 'jornadaConfig'],
    });

    if (!registroCompleto) {
      throw new HttpException('Error al cargar registro completo', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.logger.log(`✅ Llegada registrada: ${registroGuardado.id} - ${registroCompleto.personal.nombre} ${registroCompleto.personal.apellido} a las ${registroGuardado.horaLlegada}`);

    return registroCompleto;
  }

  /**
   * 📋 Obtener asistencias por fecha y jornada
   */
  async obtenerAsistencias(dto: ObtenerAsistenciaDto): Promise<RegistroAsistencia[]> {
    this.logger.log(`📋 Obteniendo asistencias para fecha: ${dto.fecha}, jornada: ${dto.jornadaConfigId || 'todas'}`);

    const query = this.asistenciaRepository.createQueryBuilder('asistencia')
      .leftJoinAndSelect('asistencia.personal', 'personal')
      .leftJoinAndSelect('personal.tipoPersonal', 'tipoPersonal')
      .leftJoinAndSelect('asistencia.jornadaConfig', 'jornadaConfig')
      .where('asistencia.fecha = :fecha', { fecha: dto.fecha })
      .andWhere('asistencia.clubId = :clubId', { clubId: dto.clubId });

    if (dto.jornadaConfigId) {
      query.andWhere('asistencia.jornadaConfigId = :jornadaConfigId', { jornadaConfigId: dto.jornadaConfigId });
    }

    query.orderBy('asistencia.ordenCalculado', 'ASC', 'NULLS LAST')
      .addOrderBy('asistencia.horaLlegada', 'ASC');

    const asistencias = await query.getMany();

    this.logger.log(`✅ Encontradas ${asistencias.length} asistencias`);

    return asistencias;
  }

  /**
   * 📝 Actualizar registro de asistencia
   */
  async actualizarAsistencia(id: string, dto: ActualizarAsistenciaDto): Promise<RegistroAsistencia> {
    this.logger.log(`📝 Actualizando asistencia ${id}`);

    const registro = await this.asistenciaRepository.findOne({ where: { id } });

    if (!registro) {
      throw new NotFoundException('Registro de asistencia no encontrado');
    }

    Object.assign(registro, dto);

    const registroActualizado = await this.asistenciaRepository.save(registro);

    this.logger.log(`✅ Asistencia actualizada: ${registroActualizado.id}`);

    return registroActualizado;
  }

  /**
   * 🔢 Calcular y actualizar orden automático
   * Algoritmo: 
   * - Menor cantidad de turnos ayer = Mayor prioridad
   * - Si empate: Tareas completadas = Mayor prioridad
   * - Si empate: Hora de llegada más temprana = Mayor prioridad
   */
  async calcularOrdenAutomatico(fecha: Date, jornadaConfigId: number, clubId: string): Promise<void> {
    this.logger.log(`🔢 Calculando orden automático para jornada ${jornadaConfigId} en fecha ${fecha}`);

    const asistencias = await this.obtenerAsistencias({ fecha, jornadaConfigId, clubId });

    // Ordenar según criterios
    const asistenciasOrdenadas = asistencias.sort((a, b) => {
      // 1. Menos turnos ayer = primero
      if (a.turnosRealizadosAyer !== b.turnosRealizadosAyer) {
        return a.turnosRealizadosAyer - b.turnosRealizadosAyer;
      }

      // 2. Tareas completadas = primero
      if (a.tareasCompletadas !== b.tareasCompletadas) {
        return b.tareasCompletadas ? -1 : 1;
      }

      // 3. Hora de llegada más temprana = primero
      return new Date(a.horaLlegada).getTime() - new Date(b.horaLlegada).getTime();
    });

    // Asignar orden
    for (let i = 0; i < asistenciasOrdenadas.length; i++) {
      asistenciasOrdenadas[i].ordenCalculado = i + 1;
      await this.asistenciaRepository.save(asistenciasOrdenadas[i]);
    }

    this.logger.log(`✅ Orden calculado y asignado para ${asistenciasOrdenadas.length} registros`);
  }

  /**
   * 👥 Obtener personal disponible para registrar en una jornada
   */
  async obtenerPersonalDisponible(jornadaConfigId: number, clubId: string): Promise<any[]> {
    this.logger.log(`👥 Obteniendo personal disponible para jornada ${jornadaConfigId}`);

    // Consulta SQL para obtener personal asignado a esa jornada o sin jornada asignada
    const personal = await this.asistenciaRepository.query(`
      SELECT 
        p.id,
        p.nombre,
        p.apellido,
        p.telefono,
        tp.nombre as tipo_personal,
        p.jornada_asignada_id,
        CASE 
          WHEN ra.id IS NOT NULL THEN true 
          ELSE false 
        END as ya_registro_hoy,
        CASE 
          WHEN ra.id IS NOT NULL AND ra.presente = true THEN 'presente'
          WHEN ra.id IS NOT NULL AND ra.presente = false THEN 'ausente'
          ELSE NULL
        END as estado_asistencia
      FROM auth.personal p
      LEFT JOIN auth.tipos_personal tp ON p.tipo_personal_id = tp.id
      LEFT JOIN auth.registro_asistencia ra ON ra.personal_id = p.id 
        AND ra.fecha = CURRENT_DATE 
        AND ra.jornada_config_id = $1
      WHERE p.club_id = $2 
        AND p.activo = true
        AND (p.jornada_asignada_id = $1 OR p.jornada_asignada_id IS NULL)
      ORDER BY p.nombre ASC
    `, [jornadaConfigId, clubId]);

    this.logger.log(`✅ Encontrados ${personal.length} registros de personal`);
    this.logger.log(`🔍 DEBUG Personal:`, JSON.stringify(personal, null, 2));

    return personal;
  }

  /**
   * 🗑️ Eliminar registro de asistencia
   */
  async eliminarAsistencia(id: string): Promise<void> {
    this.logger.log(`🗑️ Eliminando asistencia ${id}`);

    const registro = await this.asistenciaRepository.findOne({ where: { id } });

    if (!registro) {
      throw new NotFoundException('Registro de asistencia no encontrado');
    }

    // Primero eliminar las tareas asignadas a este registro
    const tareasAsignadas = await this.tareasAsignadasRepository.find({
      where: { registroAsistenciaId: id }
    });

    if (tareasAsignadas.length > 0) {
      this.logger.log(`🗑️ Eliminando ${tareasAsignadas.length} tarea(s) asignada(s)`);
      await this.tareasAsignadasRepository.remove(tareasAsignadas);
    }

    // Ahora eliminar el registro de asistencia
    await this.asistenciaRepository.remove(registro);

    this.logger.log(`✅ Asistencia eliminada: ${id}`);
  }

  /**
   * 📊 Obtener estadísticas de asistencia
   */
  async obtenerEstadisticas(fecha: Date, clubId: string): Promise<any> {
    this.logger.log(`📊 Obteniendo estadísticas de asistencia para fecha ${fecha}`);

    const estadisticas = await this.asistenciaRepository
      .createQueryBuilder('asistencia')
      .select('COUNT(DISTINCT asistencia.id)', 'total_registros')
      .addSelect('COUNT(DISTINCT CASE WHEN asistencia.presente = true THEN asistencia.personalId END)', 'total_presentes')
      .addSelect('COUNT(DISTINCT CASE WHEN asistencia.tareasCompletadas = true THEN asistencia.id END)', 'total_con_tareas_completas')
      .addSelect('AVG(asistencia.turnosRealizadosAyer)', 'promedio_turnos_ayer')
      .where('asistencia.fecha = :fecha', { fecha })
      .andWhere('asistencia.clubId = :clubId', { clubId })
      .getRawOne();

    return {
      totalRegistros: parseInt(estadisticas.total_registros) || 0,
      totalPresentes: parseInt(estadisticas.total_presentes) || 0,
      totalConTareasCompletas: parseInt(estadisticas.total_con_tareas_completas) || 0,
      promedioTurnosAyer: parseFloat(estadisticas.promedio_turnos_ayer) || 0,
    };
  }
}
