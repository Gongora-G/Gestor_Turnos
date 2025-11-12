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
import { BoleadoresService } from './boleadores.service';
import { CreateBoleadorDto } from './dto/create-boleador.dto';
import { UpdateBoleadorDto } from './dto/update-boleador.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('boleadores')
@UseGuards(JwtAuthGuard)
export class BoleadoresController {
  constructor(private readonly boleadoresService: BoleadoresService) {}

  @Post()
  create(@Body() createBoleadorDto: CreateBoleadorDto) {
    return this.boleadoresService.create(createBoleadorDto);
  }

  @Get()
  findAll(@Query('clubId') clubId?: string) {
    return this.boleadoresService.findAll(clubId);
  }

  @Get('disponibles')
  findAvailable(
    @Query('clubId') clubId: string,
    @Query('fecha') fecha: string,
    @Query('horaInicio') horaInicio: string,
    @Query('horaFin') horaFin: string,
  ) {
    return this.boleadoresService.findAvailableByDateTime(clubId, fecha, horaInicio, horaFin);
  }

  @Get('por-nivel')
  findByNivel(
    @Query('clubId') clubId: string,
    @Query('nivel') nivel: string,
  ) {
    return this.boleadoresService.findByNivelJuego(clubId, nivel);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boleadoresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoleadorDto: UpdateBoleadorDto) {
    return this.boleadoresService.update(id, updateBoleadorDto);
  }

  @Patch(':id/estado')
  updateEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.boleadoresService.updateEstado(id, estado);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boleadoresService.remove(id);
  }
}