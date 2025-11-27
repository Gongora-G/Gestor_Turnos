import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TareasService } from './tareas.service';
import { CreateTareaDto, UpdateTareaDto, AsignarTareasDto, CompletarTareaDto } from './dto/tarea.dto';

@Controller('tareas')
@UseGuards(JwtAuthGuard)
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  // ========== CRUD de Tareas Predefinidas ==========

  @Post()
  async crearTarea(@Body() createTareaDto: CreateTareaDto, @Request() req) {
    const clubId = req.user.clubId;
    return await this.tareasService.crearTarea(createTareaDto, clubId);
  }

  @Get()
  async obtenerTareas(@Request() req) {
    const clubId = req.user.clubId;
    return await this.tareasService.obtenerTareas(clubId);
  }

  @Get('activas')
  async obtenerTareasActivas(@Request() req) {
    const clubId = req.user.clubId;
    return await this.tareasService.obtenerTareasActivas(clubId);
  }

  @Get('categorias')
  async obtenerCategorias(@Request() req) {
    const clubId = req.user.clubId;
    return await this.tareasService.obtenerCategorias(clubId);
  }

  @Get('estadisticas')
  async obtenerEstadisticas(@Request() req, @Query('fecha') fecha?: string) {
    const clubId = req.user.clubId;
    return await this.tareasService.obtenerEstadisticasTareas(clubId, fecha);
  }

  @Get(':id')
  async obtenerTarea(@Param('id') id: string, @Request() req) {
    const clubId = req.user.clubId;
    return await this.tareasService.obtenerTarea(+id, clubId);
  }

  @Patch(':id')
  async actualizarTarea(
    @Param('id') id: string,
    @Body() updateTareaDto: UpdateTareaDto,
    @Request() req,
  ) {
    const clubId = req.user.clubId;
    return await this.tareasService.actualizarTarea(+id, updateTareaDto, clubId);
  }

  @Delete(':id')
  async eliminarTarea(@Param('id') id: string, @Request() req) {
    const clubId = req.user.clubId;
    await this.tareasService.eliminarTarea(+id, clubId);
    return { message: 'Tarea eliminada exitosamente' };
  }

  @Patch(':id/toggle-activa')
  async toggleActiva(@Param('id') id: string, @Request() req) {
    const clubId = req.user.clubId;
    return await this.tareasService.toggleActiva(+id, clubId);
  }

  // ========== Tareas Asignadas ==========

  @Post('asignar/:registroAsistenciaId')
  async asignarTareas(
    @Param('registroAsistenciaId') registroAsistenciaId: string,
    @Body() asignarTareasDto: AsignarTareasDto,
    @Request() req,
  ) {
    const clubId = req.user.clubId;
    return await this.tareasService.asignarTareas(
      registroAsistenciaId,
      asignarTareasDto.tareaIds,
      clubId,
    );
  }

  @Get('asignadas/:registroAsistenciaId')
  async obtenerTareasAsignadas(
    @Param('registroAsistenciaId') registroAsistenciaId: string,
    @Request() req,
  ) {
    const clubId = req.user.clubId;
    return await this.tareasService.obtenerTareasAsignadas(registroAsistenciaId, clubId);
  }

  @Patch('asignada/:id/completar')
  async completarTarea(
    @Param('id') id: string,
    @Body() completarTareaDto: CompletarTareaDto,
    @Request() req,
  ) {
    const clubId = req.user.clubId;
    return await this.tareasService.completarTarea(id, completarTareaDto, clubId);
  }

  @Patch('asignada/:id/descompletar')
  async descompletarTarea(@Param('id') id: string, @Request() req) {
    const clubId = req.user.clubId;
    return await this.tareasService.descompletarTarea(id, clubId);
  }

  @Delete('asignada/:id')
  async eliminarTareaAsignada(@Param('id') id: string, @Request() req) {
    const clubId = req.user.clubId;
    await this.tareasService.eliminarTareaAsignada(id, clubId);
    return { message: 'Tarea asignada eliminada exitosamente' };
  }
}
