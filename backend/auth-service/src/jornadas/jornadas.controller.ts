import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  DefaultValuePipe,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { JornadasService } from './jornadas.service';
import { CreateJornadaTurnoDto } from './dto/create-jornada-turno.dto';
import { UpdateJornadaTurnoDto } from './dto/update-jornada-turno.dto';

@Controller('jornadas')
export class JornadasController {
  constructor(private readonly jornadasService: JornadasService) {}

  @Post()
  create(@Body() createJornadaTurnoDto: CreateJornadaTurnoDto) {
    return this.jornadasService.create(createJornadaTurnoDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('busqueda') busqueda?: string,
    @Query('activa') activa?: boolean,
  ) {
    return this.jornadasService.findAll(page, limit, fechaInicio, fechaFin, busqueda, activa);
  }

  @Get('estadisticas')
  getEstadisticas() {
    return this.jornadasService.getEstadisticas();
  }

  @Get('fecha/:fecha')
  findByFecha(@Param('fecha') fecha: string) {
    return this.jornadasService.findByFecha(fecha);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.jornadasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateJornadaTurnoDto: UpdateJornadaTurnoDto,
  ) {
    return this.jornadasService.update(id, updateJornadaTurnoDto);
  }

  @Patch(':id/toggle-activa')
  toggleActiva(@Param('id', ParseUUIDPipe) id: string) {
    return this.jornadasService.toggleActiva(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.jornadasService.remove(id);
  }
}