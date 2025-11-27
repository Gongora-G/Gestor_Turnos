import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { RegistroAsistencia } from '../asistencia/entities/registro-asistencia.entity';
import { Personal } from '../personal/entities/personal.entity';
import { Turno } from '../turnos/entities/turno.entity';

export interface ReporteAsistenciasDto {
  fechaInicio: string;
  fechaFin: string;
  jornadaId?: number;
  tipoPersonalId?: number;
}

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(RegistroAsistencia)
    private registroAsistenciaRepository: Repository<RegistroAsistencia>,
    @InjectRepository(Personal)
    private personalRepository: Repository<Personal>,
    @InjectRepository(Turno)
    private turnoRepository: Repository<Turno>,
  ) {}

  async generarReporteAsistencias(filtros: ReporteAsistenciasDto) {
    const { fechaInicio, fechaFin, jornadaId, tipoPersonalId } = filtros;

    const queryBuilder = this.registroAsistenciaRepository
      .createQueryBuilder('registro')
      .leftJoinAndSelect('registro.personal', 'personal')
      .leftJoinAndSelect('personal.tipoPersonal', 'tipoPersonal')
      .leftJoinAndSelect('registro.jornadaConfig', 'jornadaConfig')
      .where('registro.fecha BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin,
      });

    if (jornadaId) {
      queryBuilder.andWhere('registro.jornadaConfigId = :jornadaId', { jornadaId });
    }

    if (tipoPersonalId) {
      queryBuilder.andWhere('personal.tipoPersonalId = :tipoPersonalId', {
        tipoPersonalId,
      });
    }

    const registros = await queryBuilder
      .orderBy('registro.fecha', 'DESC')
      .addOrderBy('registro.horaLlegada', 'ASC')
      .getMany();

    const totalRegistros = registros.length;
    const asistencias = registros.filter((r) => r.presente).length;
    const ausencias = registros.filter((r) => !r.presente).length;
    const porcentajeAsistencia =
      totalRegistros > 0 ? (asistencias / totalRegistros) * 100 : 0;

    const porPersonal = registros.reduce((acc, registro) => {
      const personalId = registro.personal.id;
      if (!acc[personalId]) {
        acc[personalId] = {
          personal: {
            id: registro.personal.id,
            nombre: registro.personal.nombre,
            apellido: registro.personal.apellido,
            tipoPersonal: registro.personal.tipoPersonal.nombre,
          },
          totalRegistros: 0,
          asistencias: 0,
          ausencias: 0,
          porcentaje: 0,
        };
      }
      acc[personalId].totalRegistros++;
      if (registro.presente) {
        acc[personalId].asistencias++;
      } else {
        acc[personalId].ausencias++;
      }
      acc[personalId].porcentaje = (
        (acc[personalId].asistencias / acc[personalId].totalRegistros) * 100
      ).toFixed(2);
      return acc;
    }, {});

    const porFecha = registros.reduce((acc, registro) => {
      const fechaStr = registro.fecha.toString();
      if (!acc[fechaStr]) {
        acc[fechaStr] = {
          fecha: fechaStr,
          totalRegistros: 0,
          asistencias: 0,
          ausencias: 0,
          porcentaje: 0,
        };
      }
      acc[fechaStr].totalRegistros++;
      if (registro.presente) {
        acc[fechaStr].asistencias++;
      } else {
        acc[fechaStr].ausencias++;
      }
      acc[fechaStr].porcentaje = (
        (acc[fechaStr].asistencias / acc[fechaStr].totalRegistros) * 100
      ).toFixed(2);
      return acc;
    }, {});

    return {
      resumen: {
        fechaInicio,
        fechaFin,
        totalRegistros,
        asistencias,
        ausencias,
        porcentajeAsistencia: Number(porcentajeAsistencia.toFixed(2)),
      },
      porPersonal: Object.values(porPersonal),
      porFecha: Object.values(porFecha).sort((a: any, b: any) =>
        a.fecha.localeCompare(b.fecha),
      ),
      registrosDetallados: registros.map((r) => ({
        id: r.id,
        fecha: r.fecha,
        horaLlegada: r.horaLlegada,
        horaSalida: r.horaSalida,
        presente: r.presente,
        tareasCompletadas: r.tareasCompletadas,
        tareasPendientes: r.tareasPendientes,
        turnosRealizadosAyer: r.turnosRealizadosAyer,
        ordenCalculado: r.ordenCalculado,
        observaciones: r.observaciones,
        personal: {
          id: r.personal.id,
          nombre: `${r.personal.nombre} ${r.personal.apellido}`,
          tipoPersonal: r.personal.tipoPersonal.nombre,
        },
        jornadaConfig: r.jornadaConfig
          ? {
              id: r.jornadaConfig.id,
              nombre: r.jornadaConfig.nombre,
            }
          : null,
      })),
    };
  }

  async generarReporteTurnos(filtros: ReporteAsistenciasDto) {
    const { fechaInicio, fechaFin, jornadaId } = filtros;

    const queryBuilder = this.turnoRepository
      .createQueryBuilder('turno')
      .leftJoinAndSelect('turno.caddie', 'caddie')
      .leftJoinAndSelect('turno.boleador', 'boleador')
      .where('turno.fecha BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin,
      });

    if (jornadaId) {
      queryBuilder.andWhere('turno.jornada_config_id = :jornadaId', { jornadaId });
    }

    const turnos = await queryBuilder
      .orderBy('turno.fecha', 'DESC')
      .addOrderBy('turno.hora_inicio', 'ASC')
      .getMany();

    // Obtener todos los IDs de personal asignado para consultar sus nombres
    const personalIds = new Set<string>();
    turnos.forEach(turno => {
      if (turno.personal_asignado && turno.personal_asignado.length > 0) {
        turno.personal_asignado.forEach(id => personalIds.add(id));
      }
    });

    // Consultar nombres del personal
    const personalMap = new Map<string, { nombre: string; tipo: string }>();
    if (personalIds.size > 0) {
      const personalList = await this.personalRepository
        .createQueryBuilder('personal')
        .leftJoinAndSelect('personal.tipoPersonal', 'tipoPersonal')
        .where('personal.id IN (:...ids)', { ids: Array.from(personalIds) })
        .getMany();
      
      personalList.forEach(p => {
        personalMap.set(p.id.toString(), {
          nombre: `${p.nombre} ${p.apellido}`,
          tipo: p.tipoPersonal?.nombre || 'Personal'
        });
      });
    }

    // Calcular estado real de cada turno según fecha/hora
    const now = new Date();
    const turnosConEstadoReal = turnos.map(turno => {
      const fechaTurno = new Date(turno.fecha + 'T' + turno.hora_fin);
      const estadoReal = fechaTurno < now ? 'completado' : turno.estado;
      
      // Unificar personal asignado
      const personalUnificado: Array<{ id: string; nombre?: string; tipo: string }> = [];
      if (turno.caddie) {
        personalUnificado.push({
          id: turno.caddie.id,
          nombre: turno.caddie.nombre,
          tipo: 'Caddie'
        });
      }
      if (turno.boleador) {
        personalUnificado.push({
          id: turno.boleador.id,
          nombre: turno.boleador.nombre,
          tipo: 'Boleador'
        });
      }
      // Agregar personal_asignado del nuevo sistema con sus nombres
      if (turno.personal_asignado && turno.personal_asignado.length > 0) {
        turno.personal_asignado.forEach(pId => {
          const personalInfo = personalMap.get(pId);
          personalUnificado.push({
            id: pId,
            nombre: personalInfo?.nombre,
            tipo: personalInfo?.tipo || 'Personal'
          });
        });
      }
      
      return {
        ...turno,
        estadoReal,
        personalUnificado
      };
    });

    const totalTurnos = turnosConEstadoReal.length;
    const completados = turnosConEstadoReal.filter((t) => t.estadoReal === 'completado').length;
    const enProgreso = turnosConEstadoReal.filter((t) => t.estadoReal === 'en_progreso').length;
    const guardados = turnosConEstadoReal.filter((t) => t.estado_registro === 'GUARDADO').length;
    const activos = turnosConEstadoReal.filter((t) => t.estado_registro === 'ACTIVO').length;

    // Agrupar por fecha
    const porFecha = turnosConEstadoReal.reduce((acc, turno) => {
      const fecha = turno.fecha;
      if (!acc[fecha]) {
        acc[fecha] = {
          fecha,
          total: 0,
          completados: 0,
          enProgreso: 0,
        };
      }
      acc[fecha].total++;
      if (turno.estadoReal === 'completado') {
        acc[fecha].completados++;
      } else if (turno.estadoReal === 'en_progreso') {
        acc[fecha].enProgreso++;
      }
      return acc;
    }, {});

    // Agrupar por cancha
    const porCancha = turnosConEstadoReal.reduce((acc, turno) => {
      const canchaId = turno.cancha_id;
      if (!acc[canchaId]) {
        acc[canchaId] = {
          canchaId,
          total: 0,
          completados: 0,
          enProgreso: 0,
        };
      }
      acc[canchaId].total++;
      if (turno.estadoReal === 'completado') {
        acc[canchaId].completados++;
      } else if (turno.estadoReal === 'en_progreso') {
        acc[canchaId].enProgreso++;
      }
      return acc;
    }, {});

    return {
      resumen: {
        fechaInicio,
        fechaFin,
        totalTurnos,
        completados,
        enProgreso,
        guardados,
        activos,
        porcentajeCompletado: totalTurnos > 0 ? Number(((completados / totalTurnos) * 100).toFixed(2)) : 0,
      },
      porFecha: Object.values(porFecha).sort((a: any, b: any) => a.fecha.localeCompare(b.fecha)),
      porCancha: Object.values(porCancha),
      turnosDetallados: turnosConEstadoReal.map((t) => ({
        id: t.id,
        nombre: t.nombre,
        numeroTurnoDia: t.numero_turno_dia,
        fecha: t.fecha,
        horaInicio: t.hora_inicio,
        horaFin: t.hora_fin,
        canchaId: t.cancha_id,
        estado: t.estadoReal,
        estadoOriginal: t.estado,
        estadoRegistro: t.estado_registro,
        personalAsignado: t.personalUnificado,
        observaciones: t.observaciones,
      })),
    };
  }

  async generarReportePersonal(filtros: ReporteAsistenciasDto) {
    const { tipoPersonalId } = filtros;

    const queryBuilder = this.personalRepository
      .createQueryBuilder('personal')
      .leftJoinAndSelect('personal.tipoPersonal', 'tipoPersonal')
      .leftJoinAndSelect('personal.estadoObj', 'estadoObj')
      .where('personal.activo = :activo', { activo: true });

    if (tipoPersonalId) {
      queryBuilder.andWhere('personal.tipoPersonalId = :tipoPersonalId', {
        tipoPersonalId,
      });
    }

    const personal = await queryBuilder.getMany();

    const porTipo = personal.reduce((acc, p) => {
      const tipo = p.tipoPersonal.nombre;
      if (!acc[tipo]) {
        acc[tipo] = {
          tipoPersonal: tipo,
          total: 0,
          disponibles: 0,
          ocupados: 0,
          inactivos: 0,
        };
      }
      acc[tipo].total++;
      if (p.estadoObj) {
        if (p.estadoObj.nombre.toLowerCase() === 'disponible') {
          acc[tipo].disponibles++;
        } else if (p.estadoObj.esOcupado) {
          acc[tipo].ocupados++;
        } else if (p.estadoObj.nombre.toLowerCase() === 'inactivo') {
          acc[tipo].inactivos++;
        }
      }
      return acc;
    }, {});

    return {
      resumen: {
        totalPersonal: personal.length,
        porTipo: Object.values(porTipo),
      },
      personal: personal.map((p) => ({
        id: p.id,
        nombre: `${p.nombre} ${p.apellido}`,
        tipoPersonal: p.tipoPersonal.nombre,
        estado: p.estadoObj ? p.estadoObj.nombre : p.estado,
        telefono: p.telefono,
        email: p.email,
      })),
    };
  }
}
