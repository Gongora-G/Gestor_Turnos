import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Socio, EstadoSocio } from './entities/socio.entity';
import { CreateSocioDto, UpdateSocioDto, FiltrosSociosDto } from './dto/socio.dto';

@Injectable()
export class SociosService {
  constructor(
    @InjectRepository(Socio)
    private sociosRepository: Repository<Socio>,
  ) {}

  private convertirFecha(fecha: string): string {
    // Si la fecha está en formato DD/MM/YYYY, convertir a YYYY-MM-DD
    if (fecha && fecha.includes('/')) {
      const [dia, mes, año] = fecha.split('/');
      return `${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }
    // Si ya está en formato correcto o es ISO, devolverla como está
    return fecha ? fecha.split('T')[0] : fecha;
  }

  async create(createSocioDto: CreateSocioDto, clubId: string): Promise<Socio> {
    // Verificar que el email y documento no estén en uso
    const existeEmail = await this.sociosRepository.findOne({
      where: { email: createSocioDto.email, club_id: clubId },
    });

    if (existeEmail) {
      throw new ConflictException('Ya existe un socio con este email');
    }

    const existeDocumento = await this.sociosRepository.findOne({
      where: { documento: createSocioDto.documento, club_id: clubId },
    });

    if (existeDocumento) {
      throw new ConflictException('Ya existe un socio con este documento');
    }

    // Convertir fechas al formato correcto
    const datosConFechasConvertidas = {
      ...createSocioDto,
      fecha_nacimiento: createSocioDto.fecha_nacimiento ? this.convertirFecha(createSocioDto.fecha_nacimiento) : undefined,
      fecha_inicio_membresia: this.convertirFecha(createSocioDto.fecha_inicio_membresia),
      club_id: clubId,
    };

    const socio = this.sociosRepository.create(datosConFechasConvertidas);

    return await this.sociosRepository.save(socio);
  }

  async findAll(filtros: FiltrosSociosDto, clubId: string): Promise<Socio[]> {
    const query = this.sociosRepository.createQueryBuilder('socio')
      // .leftJoinAndSelect('socio.tipo_membresia', 'tipo_membresia') // Comentado temporalmente
      .where('socio.club_id = :clubId', { clubId });

    if (filtros.nombre) {
      query.andWhere('(socio.nombre ILIKE :nombre OR socio.apellido ILIKE :nombre)', {
        nombre: `%${filtros.nombre}%`,
      });
    }

    if (filtros.email) {
      query.andWhere('socio.email ILIKE :email', { email: `%${filtros.email}%` });
    }

    if (filtros.documento) {
      query.andWhere('socio.documento ILIKE :documento', { documento: `%${filtros.documento}%` });
    }

    if (filtros.tipo_membresia_id) {
      query.andWhere('socio.tipo_membresia_id = :tipoMembresiaId', {
        tipoMembresiaId: filtros.tipo_membresia_id,
      });
    }

    if (filtros.estado) {
      query.andWhere('socio.estado = :estado', { estado: filtros.estado });
    }

    if (filtros.fecha_inicio && filtros.fecha_fin) {
      query.andWhere('socio.fecha_inicio_membresia BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio: filtros.fecha_inicio,
        fechaFin: filtros.fecha_fin,
      });
    }

    return await query.orderBy('socio.nombre', 'ASC').getMany();
  }

  async findOne(id: string, clubId: string): Promise<Socio> {
    const socio = await this.sociosRepository.findOne({
      where: { id, club_id: clubId },
      // relations: ['tipo_membresia'], // Comentado temporalmente
    });

    if (!socio) {
      throw new NotFoundException('Socio no encontrado');
    }

    return socio;
  }

  async update(id: string, updateSocioDto: UpdateSocioDto, clubId: string): Promise<Socio> {
    console.log('🔍 SociosService.update - ID:', id);
    console.log('🔍 SociosService.update - ClubId:', clubId);
    console.log('🔍 SociosService.update - Datos a actualizar:', JSON.stringify(updateSocioDto, null, 2));
    
    const socio = await this.findOne(id, clubId);
    console.log('✅ Socio encontrado:', socio.id, socio.nombre, socio.apellido);

    // Verificar email único si se está actualizando
    if (updateSocioDto.email && updateSocioDto.email !== socio.email) {
      console.log('🔍 Verificando email único:', updateSocioDto.email);
      const existeEmail = await this.sociosRepository.findOne({
        where: { email: updateSocioDto.email, club_id: clubId },
      });

      if (existeEmail) {
        console.error('❌ Email ya existe:', updateSocioDto.email);
        throw new ConflictException('Ya existe un socio con este email');
      }
    }

    // Verificar documento único si se está actualizando
    if (updateSocioDto.documento && updateSocioDto.documento !== socio.documento) {
      console.log('🔍 Verificando documento único:', updateSocioDto.documento);
      const existeDocumento = await this.sociosRepository.findOne({
        where: { documento: updateSocioDto.documento, club_id: clubId },
      });

      if (existeDocumento) {
        console.error('❌ Documento ya existe:', updateSocioDto.documento);
        throw new ConflictException('Ya existe un socio con este documento');
      }
    }

    console.log('🔄 Aplicando cambios...');
    
    // Convertir fechas al formato correcto antes de aplicar cambios
    const datosConFechasConvertidas = {
      ...updateSocioDto,
      fecha_nacimiento: updateSocioDto.fecha_nacimiento ? this.convertirFecha(updateSocioDto.fecha_nacimiento) : updateSocioDto.fecha_nacimiento,
      fecha_inicio_membresia: updateSocioDto.fecha_inicio_membresia ? this.convertirFecha(updateSocioDto.fecha_inicio_membresia) : updateSocioDto.fecha_inicio_membresia,
    };
    
    console.log('🔄 Datos con fechas convertidas:', JSON.stringify(datosConFechasConvertidas, null, 2));
    Object.assign(socio, datosConFechasConvertidas);
    
    console.log('💾 Guardando socio actualizado...');
    const socioActualizado = await this.sociosRepository.save(socio);
    console.log('✅ Socio guardado exitosamente:', socioActualizado.id);
    
    return socioActualizado;
  }

  async remove(id: string, clubId: string): Promise<void> {
    const socio = await this.findOne(id, clubId);
    await this.sociosRepository.remove(socio);
  }

  async cambiarEstado(id: string, estado: string, clubId: string): Promise<Socio> {
    const socio = await this.findOne(id, clubId);
    socio.estado = estado as any;
    return await this.sociosRepository.save(socio);
  }

  async findActivos(clubId: string): Promise<Socio[]> {
    return await this.sociosRepository.find({
      where: { estado: EstadoSocio.ACTIVO, club_id: clubId },
      // relations: ['tipo_membresia'], // Comentado temporalmente
      order: { nombre: 'ASC' },
    });
  }

  async buscar(termino: string, clubId: string): Promise<Socio[]> {
    return await this.sociosRepository.createQueryBuilder('socio')
      // .leftJoinAndSelect('socio.tipo_membresia', 'tipo_membresia') // Comentado temporalmente
      .where('socio.club_id = :clubId', { clubId })
      .andWhere(
        '(socio.nombre ILIKE :termino OR socio.apellido ILIKE :termino OR socio.email ILIKE :termino OR socio.documento ILIKE :termino)',
        { termino: `%${termino}%` }
      )
      .orderBy('socio.nombre', 'ASC')
      .getMany();
  }

  async renovarMembresia(id: string, tipoMembresiaId: string, fechaInicio: string, clubId: string): Promise<Socio> {
    const socio = await this.findOne(id, clubId);
    
    socio.tipo_membresia_id = tipoMembresiaId;
    socio.fecha_inicio_membresia = fechaInicio;
    
    // Calcular fecha de vencimiento (ejemplo: 1 año)
    const fechaVencimiento = new Date(fechaInicio);
    fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 1);
    socio.fecha_vencimiento = fechaVencimiento.toISOString().split('T')[0];

    return await this.sociosRepository.save(socio);
  }
}