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
import { SociosService } from './socios.service';
import { CreateSocioDto, UpdateSocioDto, FiltrosSociosDto } from './dto/socio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('socios')
@UseGuards(JwtAuthGuard)
export class SociosController {
  constructor(private readonly sociosService: SociosService) {}

  @Post()
  create(@Body() createSocioDto: CreateSocioDto, @GetUser() user: User) {
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.sociosService.create(createSocioDto, user.clubId);
  }

  @Get()
  findAll(@Query() filtros: FiltrosSociosDto, @GetUser() user: User) {
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.sociosService.findAll(filtros, user.clubId);
  }

  @Get('activos')
  findActivos(@GetUser() user: User) {
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.sociosService.findActivos(user.clubId);
  }

  @Get('buscar')
  buscar(@Query('q') termino: string, @GetUser() user: User) {
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.sociosService.buscar(termino, user.clubId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.sociosService.findOne(id, user.clubId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSocioDto: UpdateSocioDto,
    @GetUser() user: User,
  ) {
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.sociosService.update(id, updateSocioDto, user.clubId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.sociosService.remove(id, user.clubId);
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
    return this.sociosService.cambiarEstado(id, estado, user.clubId);
  }

  @Patch(':id/renovar-membresia')
  renovarMembresia(
    @Param('id') id: string,
    @Body('tipo_membresia_id') tipoMembresiaId: string,
    @Body('fecha_inicio_membresia') fechaInicio: string,
    @GetUser() user: User,
  ) {
    if (!user.clubId) {
      throw new Error('Usuario no tiene club asignado');
    }
    return this.sociosService.renovarMembresia(id, tipoMembresiaId, fechaInicio, user.clubId);
  }
}