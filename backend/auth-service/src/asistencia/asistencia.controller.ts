import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Req, Logger } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { RegistrarAsistenciaDto, ActualizarAsistenciaDto, ObtenerAsistenciaDto } from './dto/asistencia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('asistencia')
@UseGuards(JwtAuthGuard)
export class AsistenciaController {
  private readonly logger = new Logger(AsistenciaController.name);

  constructor(private readonly asistenciaService: AsistenciaService) {}

  /**
   * 📝 POST /asistencia/registrar
   * Registrar llegada de personal
   */
  @Post('registrar')
  async registrarLlegada(@Body() dto: RegistrarAsistenciaDto, @Req() req: any) {
    this.logger.log('📝 POST /asistencia/registrar - Datos:', JSON.stringify(dto));
    this.logger.log('📝 Usuario:', req.user);
    dto.registradoPor = req.user.userId || req.user.id;
    dto.clubId = req.user.clubId;
    return this.asistenciaService.registrarLlegada(dto);
  }

  /**
   * 📋 GET /asistencia
   * Obtener asistencias por fecha y jornada
   */
  @Get()
  async obtenerAsistencias(@Query() query: any, @Req() req: any) {
    this.logger.log(`📋 GET /asistencia - Fecha: ${query.fecha}, Jornada: ${query.jornadaConfigId || 'todas'}`);
    
    // Parsear fecha sin conversión UTC
    const fechaSoloFecha = query.fecha.split('T')[0];
    const [year, month, day] = fechaSoloFecha.split('-').map(Number);
    const fechaDate = new Date(year, month - 1, day);
    
    const dto: ObtenerAsistenciaDto = {
      fecha: fechaDate,
      jornadaConfigId: query.jornadaConfigId ? parseInt(query.jornadaConfigId) : undefined,
      clubId: req.user.clubId,
    };

    return this.asistenciaService.obtenerAsistencias(dto);
  }

  /**
   * 📝 PUT /asistencia/:id
   * Actualizar registro de asistencia
   */
  @Put(':id')
  async actualizarAsistencia(@Param('id') id: string, @Body() dto: ActualizarAsistenciaDto) {
    this.logger.log(`📝 PUT /asistencia/${id}`);
    return this.asistenciaService.actualizarAsistencia(id, dto);
  }

  /**
   * 🔢 POST /asistencia/calcular-orden
   * Calcular orden automático
   */
  @Post('calcular-orden')
  async calcularOrden(@Body() body: { fecha: string; jornadaConfigId: number }, @Req() req: any) {
    this.logger.log(`🔢 POST /asistencia/calcular-orden - Fecha: ${body.fecha}, Jornada: ${body.jornadaConfigId}`);
    
    // Parsear fecha sin conversión UTC
    const fechaSoloFecha = body.fecha.split('T')[0];
    const [year, month, day] = fechaSoloFecha.split('-').map(Number);
    const fechaDate = new Date(year, month - 1, day);
    
    await this.asistenciaService.calcularOrdenAutomatico(
      fechaDate,
      body.jornadaConfigId,
      req.user.clubId,
    );

    return { message: 'Orden calculado exitosamente' };
  }

  /**
   * 👥 GET /asistencia/personal-disponible
   * Obtener personal disponible para registrar
   */
  @Get('personal-disponible')
  async obtenerPersonalDisponible(@Query('jornadaConfigId') jornadaConfigId: string, @Req() req: any) {
    this.logger.log(`👥 GET /asistencia/personal-disponible - Jornada: ${jornadaConfigId}`);
    return this.asistenciaService.obtenerPersonalDisponible(parseInt(jornadaConfigId), req.user.clubId);
  }

  /**
   * 🗑️ DELETE /asistencia/:id
   * Eliminar registro de asistencia
   */
  @Delete(':id')
  async eliminarAsistencia(@Param('id') id: string) {
    this.logger.log(`🗑️ DELETE /asistencia/${id}`);
    await this.asistenciaService.eliminarAsistencia(id);
    return { message: 'Registro de asistencia eliminado exitosamente' };
  }

  /**
   * 📊 GET /asistencia/estadisticas
   * Obtener estadísticas de asistencia
   */
  @Get('estadisticas')
  async obtenerEstadisticas(@Query('fecha') fecha: string, @Req() req: any) {
    this.logger.log(`📊 GET /asistencia/estadisticas - Fecha: ${fecha}`);
    
    // Parsear fecha sin conversión UTC
    const fechaSoloFecha = fecha.split('T')[0];
    const [year, month, day] = fechaSoloFecha.split('-').map(Number);
    const fechaDate = new Date(year, month - 1, day);
    
    return this.asistenciaService.obtenerEstadisticas(fechaDate, req.user.clubId);
  }
}
