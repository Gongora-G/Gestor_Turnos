import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfiguracionClub } from './entities/configuracion-club.entity';
import { UpdateConfiguracionClubDto } from './dto/configuracion-club.dto';

@Injectable()
export class ConfiguracionClubService {
  constructor(
    @InjectRepository(ConfiguracionClub)
    private readonly configuracionRepository: Repository<ConfiguracionClub>,
  ) {}

  async findByClub(clubId: string): Promise<ConfiguracionClub> {
    let configuracion = await this.configuracionRepository.findOne({
      where: { clubId },
    });

    // Si no existe configuración, crear una por defecto
    if (!configuracion) {
      configuracion = await this.createDefault(clubId);
    }

    return configuracion;
  }

  async update(updateDto: UpdateConfiguracionClubDto, clubId: string): Promise<ConfiguracionClub> {
    let configuracion = await this.configuracionRepository.findOne({
      where: { clubId },
    });

    if (!configuracion) {
      // Crear configuración por defecto si no existe
      configuracion = await this.createDefault(clubId);
    }
    
    Object.assign(configuracion, updateDto);
    
    return await this.configuracionRepository.save(configuracion);
  }

  private async createDefault(clubId: string): Promise<ConfiguracionClub> {
    const configuracionDefault = this.configuracionRepository.create({
      clubId,
      nombre: 'Mi Club de Tenis',
      hora_apertura: '06:00:00',
      hora_cierre: '22:00:00',
      duracion_turno_minutos: 60,
      reservas_automaticas: true,
      limite_reservas_usuario: 3,
      anticipacion_maxima_dias: 7,
      notificaciones_email: true,
      recordatorios_activos: true,
      backup_automatico: true,
      modo_mantenimiento: false,
    });

    return await this.configuracionRepository.save(configuracionDefault);
  }

  async getHorarios(clubId: string): Promise<{ apertura: string; cierre: string; duracionTurno: number }> {
    const config = await this.findByClub(clubId);
    
    return {
      apertura: config.hora_apertura,
      cierre: config.hora_cierre,
      duracionTurno: config.duracion_turno_minutos,
    };
  }

  async isMantenimientoActivo(clubId: string): Promise<boolean> {
    const config = await this.findByClub(clubId);
    return config.modo_mantenimiento;
  }
}