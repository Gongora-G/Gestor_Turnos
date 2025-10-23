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
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.turnosService.create(createTurnoDto, user.clubId);
  }

  @Get()
  findAll(@Query() filtros: FiltrosTurnosDto, @GetUser() user: User) {
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.turnosService.findAll(filtros, user.clubId);
  }

  @Get('disponibles')
  obtenerDisponibilidad(
    @Query('fecha') fecha: string,
    @Query('cancha_id') canchaId?: string,
    @GetUser() user?: User,
  ) {
    return this.turnosService.obtenerDisponibilidad(fecha, canchaId, user?.clubId);
  }

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
    return this.turnosService.remove(id, user.clubId);
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
}