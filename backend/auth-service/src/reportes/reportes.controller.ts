import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportesService, ReporteAsistenciasDto } from './reportes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reportes')
@UseGuards(JwtAuthGuard)
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('asistencias')
  async getReporteAsistencias(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('jornadaId') jornadaId?: string,
    @Query('tipoPersonalId') tipoPersonalId?: string,
  ) {
    const filtros: ReporteAsistenciasDto = {
      fechaInicio,
      fechaFin,
      jornadaId: jornadaId ? parseInt(jornadaId) : undefined,
      tipoPersonalId: tipoPersonalId ? parseInt(tipoPersonalId) : undefined,
    };
    return this.reportesService.generarReporteAsistencias(filtros);
  }

  @Get('turnos')
  async getReporteTurnos(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('jornadaId') jornadaId?: string,
    @Query('tipoPersonalId') tipoPersonalId?: string,
  ) {
    const filtros: ReporteAsistenciasDto = {
      fechaInicio,
      fechaFin,
      jornadaId: jornadaId ? parseInt(jornadaId) : undefined,
      tipoPersonalId: tipoPersonalId ? parseInt(tipoPersonalId) : undefined,
    };
    return this.reportesService.generarReporteTurnos(filtros);
  }

  @Get('personal')
  async getReportePersonal(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('tipoPersonalId') tipoPersonalId?: string,
  ) {
    const filtros: ReporteAsistenciasDto = {
      fechaInicio,
      fechaFin,
      tipoPersonalId: tipoPersonalId ? parseInt(tipoPersonalId) : undefined,
    };
    return this.reportesService.generarReportePersonal(filtros);
  }
}
