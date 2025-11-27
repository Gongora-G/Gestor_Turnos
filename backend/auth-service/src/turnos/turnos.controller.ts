import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto, UpdateTurnoDto, FiltrosTurnosDto } from './dto/turno.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('turnos')
@UseGuards(JwtAuthGuard)
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Post()
  create(@Body() createTurnoDto: CreateTurnoDto, @GetUser() user: User) {
    console.log('🎯 CONTROLADOR - Petición POST /turnos recibida');
    console.log('🎯 CONTROLADOR - DTO recibido:', JSON.stringify(createTurnoDto, null, 2));
    console.log('🎯 CONTROLADOR - Usuario:', user.id, 'Club:', user.clubId);
    
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.turnosService.create(createTurnoDto, user.clubId, user.id);
  }

  @Get()
  findAll(@Query() filtros: FiltrosTurnosDto, @GetUser() user: User) {
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.turnosService.findAll(filtros, user.clubId, user.id);
  }

  @Get('disponibles')
  obtenerDisponibilidad(
    @Query('fecha') fecha: string,
    @Query('cancha_id') canchaId?: string,
    @GetUser() user?: User,
  ) {
    return this.turnosService.obtenerDisponibilidad(fecha, canchaId, user?.clubId);
  }

  // 🗑️ ENDPOINTS DE PAPELERA (DEBEN IR ANTES DE LAS RUTAS CON :id)

  @Get('papelera/listar')
  obtenerPapelera(@GetUser() user: User) {
    console.log('📋 GET /turnos/papelera/listar');
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.turnosService.obtenerPapelera(user.clubId);
  }

  @Post('papelera/vaciar')
  vaciarPapelera(@GetUser() user: User) {
    console.log('🗑️💥 POST /turnos/papelera/vaciar');
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.turnosService.vaciarPapelera(user.clubId);
  }

  @Post('papelera/limpiar-automatica')
  limpiarPapeleraAutomatica(@GetUser() user: User) {
    console.log('🧹 POST /turnos/papelera/limpiar-automatica');
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.turnosService.limpiarPapeleraAutomaticamente(user.clubId);
  }

  // RUTAS CON PARÁMETROS DINÁMICOS (DEBEN IR AL FINAL)

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.turnosService.findOne(id, user.clubId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTurnoDto: UpdateTurnoDto,
    @GetUser() user: User,
  ) {
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.turnosService.update(id, updateTurnoDto, user.clubId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.turnosService.remove(id, user.clubId, user.id);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id') id: string,
    @Body('estado') estado: string,
    @GetUser() user: User,
  ) {
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.turnosService.cambiarEstado(id, estado, user.clubId);
  }

  @Post(':id/restaurar')
  restaurarTurno(@Param('id') id: string, @GetUser() user: User) {
    console.log(`♻️ POST /turnos/${id}/restaurar`);
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.turnosService.restaurarTurno(id, user.clubId);
  }

  @Delete(':id/permanente')
  eliminarPermanentemente(@Param('id') id: string, @GetUser() user: User) {
    console.log(`💥 DELETE /turnos/${id}/permanente`);
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.turnosService.eliminarPermanentemente(id, user.clubId);
  }
}