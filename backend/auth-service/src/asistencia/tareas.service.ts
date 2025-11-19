import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from './entities/tarea.entity';
import { TareaAsignada } from './entities/tarea-asignada.entity';
import { CreateTareaDto, UpdateTareaDto, CompletarTareaDto } from './dto/tarea.dto';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private tareasRepository: Repository<Tarea>,
    @InjectRepository(TareaAsignada)
    private tareasAsignadasRepository: Repository<TareaAsignada>,
  ) {}

  // ========== CRUD de Tareas Predefinidas ==========
  
  async crearTarea(createTareaDto: CreateTareaDto, clubId: string): Promise<Tarea> {
    const tarea = this.tareasRepository.create({
      ...createTareaDto,
      clubId,
    });
    return await this.tareasRepository.save(tarea);
  }

  async obtenerTareas(clubId: string): Promise<Tarea[]> {
    return await this.tareasRepository.find({
      where: { clubId },
      order: { nombre: 'ASC' },
    });
  }

  async obtenerTareasActivas(clubId: string): Promise<Tarea[]> {
    return await this.tareasRepository.find({
      where: { clubId, activa: true },
      order: { nombre: 'ASC' },
    });
  }

  async obtenerTarea(id: number, clubId: string): Promise<Tarea> {
    const tarea = await this.tareasRepository.findOne({
      where: { id, clubId },
    });

    if (!tarea) {
      throw new NotFoundException('Tarea no encontrada');
    }

    return tarea;
  }

  async actualizarTarea(id: number, updateTareaDto: UpdateTareaDto, clubId: string): Promise<Tarea> {
    const tarea = await this.obtenerTarea(id, clubId);
    Object.assign(tarea, updateTareaDto);
    return await this.tareasRepository.save(tarea);
  }

  async eliminarTarea(id: number, clubId: string): Promise<void> {
    const tarea = await this.obtenerTarea(id, clubId);
    await this.tareasRepository.remove(tarea);
  }

  async toggleActiva(id: number, clubId: string): Promise<Tarea> {
    const tarea = await this.obtenerTarea(id, clubId);
    tarea.activa = !tarea.activa;
    return await this.tareasRepository.save(tarea);
  }

  // ========== Tareas Asignadas a Registros ==========

  async asignarTareas(
    registroAsistenciaId: string,
    tareaIds: number[],
    clubId: string,
  ): Promise<TareaAsignada[]> {
    const tareasAsignadas: TareaAsignada[] = [];

    for (const tareaId of tareaIds) {
      const tareaAsignada = this.tareasAsignadasRepository.create({
        registroAsistenciaId,
        tareaId,
        clubId,
      });
      tareasAsignadas.push(await this.tareasAsignadasRepository.save(tareaAsignada));
    }

    return tareasAsignadas;
  }

  async obtenerTareasAsignadas(registroAsistenciaId: string, clubId: string): Promise<TareaAsignada[]> {
    return await this.tareasAsignadasRepository.find({
      where: { registroAsistenciaId, clubId },
      order: { createdAt: 'ASC' },
    });
  }

  async completarTarea(
    id: string,
    completarTareaDto: CompletarTareaDto,
    clubId: string,
  ): Promise<TareaAsignada> {
    const tareaAsignada = await this.tareasAsignadasRepository.findOne({
      where: { id, clubId },
    });

    if (!tareaAsignada) {
      throw new NotFoundException('Tarea asignada no encontrada');
    }

    tareaAsignada.completada = true;
    tareaAsignada.horaCompletada = new Date();
    if (completarTareaDto.notas) {
      tareaAsignada.notas = completarTareaDto.notas;
    }

    return await this.tareasAsignadasRepository.save(tareaAsignada);
  }

  async descompletarTarea(id: string, clubId: string): Promise<TareaAsignada> {
    const tareaAsignada = await this.tareasAsignadasRepository.findOne({
      where: { id, clubId },
    });

    if (!tareaAsignada) {
      throw new NotFoundException('Tarea asignada no encontrada');
    }

    tareaAsignada.completada = false;
    tareaAsignada.horaCompletada = null;

    return await this.tareasAsignadasRepository.save(tareaAsignada);
  }

  async eliminarTareaAsignada(id: string, clubId: string): Promise<void> {
    const tareaAsignada = await this.tareasAsignadasRepository.findOne({
      where: { id, clubId },
    });

    if (!tareaAsignada) {
      throw new NotFoundException('Tarea asignada no encontrada');
    }

    await this.tareasAsignadasRepository.remove(tareaAsignada);
  }

  // ========== Estadísticas ==========

  async obtenerEstadisticasTareas(clubId: string, fecha?: string): Promise<any> {
    const query = this.tareasAsignadasRepository
      .createQueryBuilder('ta')
      .leftJoinAndSelect('ta.tarea', 'tarea')
      .leftJoinAndSelect('ta.registroAsistencia', 'registro')
      .where('ta.club_id = :clubId', { clubId });

    if (fecha) {
      query.andWhere('DATE(registro.fecha) = :fecha', { fecha });
    }

    const tareasAsignadas = await query.getMany();

    const total = tareasAsignadas.length;
    const completadas = tareasAsignadas.filter(t => t.completada).length;
    const pendientes = total - completadas;
    const porcentajeCompletado = total > 0 ? Math.round((completadas / total) * 100) : 0;

    return {
      total,
      completadas,
      pendientes,
      porcentajeCompletado,
      tareasAsignadas,
    };
  }
}
