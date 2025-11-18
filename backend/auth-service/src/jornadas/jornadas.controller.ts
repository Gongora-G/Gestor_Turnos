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
import { TurnosService } from '../turnos/turnos.service';
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

  constructor(
    private readonly jornadasService: JornadasService,
    private readonly turnosService: TurnosService
  ) {}

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
      this.logger.log('✅ Resultado generado exitosamente');
      return resultado;
    } catch (error) {
      this.logger.error('❌ Error en POST /jornadas/configuracion-completa:', error);
      this.logger.error('❌ Stack:', error.stack);
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

  // 🔍 Obtener todas las jornadas configuradas del sistema
  @Get('configuradas')
  async getJornadasConfiguradas(@Request() req: any) {
    try {
      const clubId = req.user?.clubId;
      this.logger.log('🔍 GET /jornadas/configuradas - Club:', clubId);
      
      const jornadas = await this.jornadasService.getJornadasConfiguradas(clubId);
      return jornadas;
    } catch (error) {
      this.logger.error('❌ Error en GET /jornadas/configuradas:', error);
      throw error;
    }
  }

  // 📊 Obtener estadísticas detalladas de una jornada
  @Get('estadisticas/:id')
  async getEstadisticasJornada(
    @Param('id', ParseIntPipe) id: number,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Request() req: any
  ) {
    try {
      const clubId = req.user?.clubId;
      this.logger.log(`📊 GET /jornadas/estadisticas/${id} - Club: ${clubId}, Período: ${fechaInicio} a ${fechaFin}`);
      
      const estadisticas = await this.jornadasService.getEstadisticasJornada(id, clubId, fechaInicio, fechaFin);
      return estadisticas;
    } catch (error) {
      this.logger.error('❌ Error en GET /jornadas/estadisticas:', error);
      throw error;
    }
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
    const userId = req.user?.id || req.user?.userId; // Probar ambos campos
    this.logger.log('📝 POST /jornadas/guardar-jornada - Usuario completo:', JSON.stringify(req.user, null, 2));
    this.logger.log('📝 POST /jornadas/guardar-jornada - clubId:', clubId, 'userId:', userId);
    this.logger.log('📝 POST /jornadas/guardar-jornada - Guardando jornada con turnos:', JSON.stringify(body, null, 2));
    
    const resultado = await this.jornadasService.guardarRegistroJornada(clubId, userId, body);
    
    // Marcar turnos actuales como guardados para que no aparezcan en la siguiente vista
    if (body.turnos && body.turnos.length > 0) {
      const turnoIds = body.turnos.map(turno => turno.id).filter(id => id);
      if (turnoIds.length > 0) {
        this.logger.log('📝 Marcando turnos como guardados:', turnoIds);
        await this.turnosService.marcarTurnosComoGuardados(turnoIds);
      }
    }
    
    return resultado;
  }

  @Post('activar-siguiente')
  async activarSiguienteJornada(@Request() req: any) {
    const clubId = req.user?.clubId;
    this.logger.log(`🔄 POST /jornadas/activar-siguiente - Club: ${clubId}`);
    return await this.jornadasService.activarSiguienteJornada(clubId);
  }

  // ==========================================
  // 🗑️ SOFT DELETE Y PAPELERA
  // ==========================================

  @Delete('registro-diario/:id')
  async eliminarRegistroDiario(
    @Param('id') id: string,
    @Request() req: any
  ) {
    const userId = req.user?.userId || req.user?.id;
    this.logger.log(`🗑️ DELETE /jornadas/registro-diario/${id} - Usuario: ${userId}`);
    return await this.jornadasService.eliminarRegistroDiario(id, userId);
  }

  @Post('registro-diario/:id/restaurar')
  async restaurarRegistroDiario(@Param('id') id: string) {
    this.logger.log(`♻️ POST /jornadas/registro-diario/${id}/restaurar`);
    return await this.jornadasService.restaurarRegistroDiario(id);
  }

  @Get('papelera')
  async obtenerPapelera() {
    this.logger.log('📋 GET /jornadas/papelera');
    return await this.jornadasService.obtenerPapelera();
  }

  @Delete('registro-diario/:id/permanente')
  async eliminarPermanentemente(@Param('id') id: string) {
    this.logger.log(`💥 DELETE /jornadas/registro-diario/${id}/permanente`);
    return await this.jornadasService.eliminarPermanentemente(id);
  }

  @Post('papelera/vaciar')
  async vaciarPapelera() {
    this.logger.log('🗑️💥 POST /jornadas/papelera/vaciar');
    return await this.jornadasService.vaciarPapelera();
  }

  @Post('papelera/limpiar-automatica')
  async limpiarPapeleraAutomatica() {
    this.logger.log('🧹 POST /jornadas/papelera/limpiar-automatica');
    return await this.jornadasService.limpiarPapeleraAutomaticamente();
  }
}
