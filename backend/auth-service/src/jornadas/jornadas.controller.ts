import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Logger,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JornadasService } from './jornadas.service';
import {
  CreateJornadaConfigDto,
  UpdateJornadaConfigDto,
  ConfiguracionJornadasDto,
  ConfiguracionJornadasCompletaDto,
} from './dto/jornadas.dto';

@Controller('jornadas')
@UseGuards(JwtAuthGuard)
export class JornadasController {
  private readonly logger = new Logger(JornadasController.name);

  constructor(private readonly jornadasService: JornadasService) {}

  // ==========================================
  // CONFIGURACION COMPLETA
  // ==========================================
  @Post('configuracion-completa')
  async createConfiguracionCompleta(@Request() req: any, @Body() dto: ConfiguracionJornadasCompletaDto) {
    try {
      this.logger.log('🚀 POST /jornadas/configuracion-completa - Datos recibidos:', JSON.stringify(dto, null, 2));
      const clubId = req.user?.clubId;
      const userId = req.user?.userId;
      this.logger.log('🚀 Usuario:', userId, 'Club:', clubId);

      const resultado = await this.jornadasService.createConfiguracionCompleta(clubId, userId, dto);
      return resultado;
    } catch (error) {
      this.logger.error('❌ Error en POST /jornadas/configuracion-completa:', error);
      throw error;
    }
  }

  @Put('configuracion-completa')
  async updateConfiguracionCompleta(@Request() req: any, @Body() dto: ConfiguracionJornadasCompletaDto) {
    try {
      this.logger.log('🔄 PUT /jornadas/configuracion-completa - Datos recibidos:', JSON.stringify(dto, null, 2));
      const clubId = req.user?.clubId;
      const userId = req.user?.userId;

      return await this.jornadasService.updateConfiguracionCompleta(clubId, userId, dto);
    } catch (error) {
      this.logger.error('❌ Error en PUT /jornadas/configuracion-completa:', error);
      throw error;
    }
  }

  @Get('configuracion-activa')
  async getConfiguracionActiva(@Request() req: any) {
    const clubId = req.user?.clubId;
    return await this.jornadasService.getConfiguracionActiva(clubId);
  }

  @Get('configuraciones')
  async getConfiguraciones(@Request() req: any) {
    const clubId = req.user?.clubId;
    return await this.jornadasService.getConfiguracionesByClub(clubId);
  }

  @Get('configuracion/:id')
  async getConfiguracionById(@Param('id', ParseIntPipe) id: number) {
    return await this.jornadasService.getConfiguracionById(id);
  }

  // ==========================================
  // CRUD JORNADA CONFIG
  // ==========================================
  @Post('config')
  async createJornadaConfig(@Request() req: any, @Body() dto: CreateJornadaConfigDto) {
    const userId = req.user?.userId;
    return await this.jornadasService.createJornadaConfig(dto, userId);
  }

  @Get('config/configuracion/:configuracionId')
  async getJornadasByConfiguracion(@Param('configuracionId', ParseIntPipe) configuracionId: number) {
    return await this.jornadasService.getJornadasByConfiguracion(configuracionId);
  }

  @Get('config/:id')
  async getJornadaById(@Param('id', ParseIntPipe) id: number) {
    return await this.jornadasService.getJornadaById(id);
  }

  @Put('config/:id')
  async updateJornadaConfig(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateJornadaConfigDto
  ) {
    return await this.jornadasService.updateJornadaConfig(id, dto);
  }

  @Delete('config/:id')
  async deleteJornadaConfig(@Param('id', ParseIntPipe) id: number) {
    return await this.jornadasService.deleteJornadaConfig(id);
  }

  // ==========================================
  // REGISTROS DIARIOS
  // ==========================================
  @Get('registros-diarios')
  async getRegistrosDiarios(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string
  ) {
    const inicio = fechaInicio ? new Date(fechaInicio) : undefined;
    const fin = fechaFin ? new Date(fechaFin) : undefined;
    return await this.jornadasService.getRegistrosDiarios(inicio, fin);
  }

  @Get('jornada-actual')
  async getJornadaActual(@Request() req: any) {
    const clubId = req.user?.clubId;
    this.logger.log(`📍 GET /jornadas/jornada-actual - Club: ${clubId}`);
    return await this.jornadasService.determinarJornadaActualPorHora(clubId);
  }

  @Post('guardar-jornada')
  async guardarJornada(@Request() req: any, @Body() body: any) {
    const clubId = req.user?.clubId;
    const userId = req.user?.userId;
    this.logger.log('📝 POST /jornadas/guardar-jornada - Guardando jornada con turnos:', JSON.stringify(body, null, 2));
    return await this.jornadasService.guardarRegistroJornada(clubId, userId, body);
  }

  @Post('activar-siguiente')
  async activarSiguienteJornada(@Request() req: any) {
    const clubId = req.user?.clubId;
    this.logger.log(`🔄 POST /jornadas/activar-siguiente - Club: ${clubId}`);
    return await this.jornadasService.activarSiguienteJornada(clubId);
  }
}
