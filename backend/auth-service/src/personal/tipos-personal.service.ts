import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoPersonal } from './entities/tipo-personal.entity';
import { CreateTipoPersonalDto, UpdateTipoPersonalDto } from './dto/tipo-personal.dto';

@Injectable()
export class TiposPersonalService {
  constructor(
    @InjectRepository(TipoPersonal)
    private tiposPersonalRepository: Repository<TipoPersonal>,
  ) {}

  async create(createDto: CreateTipoPersonalDto): Promise<TipoPersonal> {
    // Verificar que el código no exista para este club
    const existente = await this.tiposPersonalRepository.findOne({
      where: {
        codigo: createDto.codigo,
        clubId: createDto.clubId,
      },
    });

    if (existente) {
      throw new BadRequestException(
        `Ya existe un tipo de personal con el código '${createDto.codigo}' en este club`,
      );
    }

    const tipoPersonal = this.tiposPersonalRepository.create(createDto);
    return await this.tiposPersonalRepository.save(tipoPersonal);
  }

  async findAll(clubId: string): Promise<TipoPersonal[]> {
    return await this.tiposPersonalRepository.find({
      where: { clubId },
      order: { nombre: 'ASC' },
    });
  }

  async findAllActivos(clubId: string): Promise<TipoPersonal[]> {
    return await this.tiposPersonalRepository.find({
      where: { clubId, activo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<TipoPersonal> {
    const tipoPersonal = await this.tiposPersonalRepository.findOne({
      where: { id },
    });

    if (!tipoPersonal) {
      throw new NotFoundException(`Tipo de personal con ID ${id} no encontrado`);
    }

    return tipoPersonal;
  }

  async update(id: number, updateDto: UpdateTipoPersonalDto): Promise<TipoPersonal> {
    const tipoPersonal = await this.findOne(id);

    // Si se está actualizando el código, verificar que no exista
    if (updateDto.codigo && updateDto.codigo !== tipoPersonal.codigo) {
      const existente = await this.tiposPersonalRepository.findOne({
        where: {
          codigo: updateDto.codigo,
          clubId: tipoPersonal.clubId,
        },
      });

      if (existente) {
        throw new BadRequestException(
          `Ya existe un tipo de personal con el código '${updateDto.codigo}' en este club`,
        );
      }
    }

    Object.assign(tipoPersonal, updateDto);
    return await this.tiposPersonalRepository.save(tipoPersonal);
  }

  async remove(id: number): Promise<void> {
    const tipoPersonal = await this.findOne(id);
    await this.tiposPersonalRepository.remove(tipoPersonal);
  }

  // Seed: Crear tipos por defecto para un nuevo club
  async crearTiposPorDefecto(clubId: string): Promise<TipoPersonal[]> {
    const tiposPorDefecto = [
      {
        nombre: 'Caddie',
        codigo: 'caddie',
        descripcion: 'Asistente de golf',
        activo: true,
        clubId,
        campos_personalizados: [
          {
            nombre: 'nivel_experiencia',
            tipo: 'number' as const,
            label: 'Nivel de Experiencia (1-10)',
            requerido: false,
          },
          {
            nombre: 'especialidades',
            tipo: 'text' as const,
            label: 'Especialidades',
            requerido: false,
            placeholder: 'Ej: Lectura de greens, estrategia de juego',
          },
        ],
      },
      {
        nombre: 'Boleador',
        codigo: 'boleador',
        descripcion: 'Encargado de recoger y preparar bolas',
        activo: true,
        clubId,
        campos_personalizados: [
          {
            nombre: 'nivel_juego',
            tipo: 'select' as const,
            label: 'Nivel de Juego',
            requerido: false,
            opciones: ['Principiante', 'Intermedio', 'Avanzado', 'Profesional'],
          },
          {
            nombre: 'deportes',
            tipo: 'text' as const,
            label: 'Deportes que Practica',
            requerido: false,
          },
        ],
      },
      {
        nombre: 'Instructor',
        codigo: 'instructor',
        descripcion: 'Instructor de golf',
        activo: true,
        clubId,
        campos_personalizados: [
          {
            nombre: 'certificaciones',
            tipo: 'textarea' as const,
            label: 'Certificaciones',
            requerido: false,
            placeholder: 'Liste las certificaciones del instructor',
          },
          {
            nombre: 'especialidad',
            tipo: 'select' as const,
            label: 'Especialidad',
            requerido: false,
            opciones: ['Swing', 'Putting', 'Chip', 'Estrategia', 'Junior', 'Todos los niveles'],
          },
        ],
      },
    ];

    const tiposCreados: TipoPersonal[] = [];
    for (const tipoDef of tiposPorDefecto) {
      const tipo = this.tiposPersonalRepository.create(tipoDef);
      const tipoGuardado = await this.tiposPersonalRepository.save(tipo);
      tiposCreados.push(tipoGuardado);
    }

    return tiposCreados;
  }
}
