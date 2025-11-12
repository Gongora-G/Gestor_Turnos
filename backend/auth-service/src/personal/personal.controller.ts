import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PersonalService } from './personal.service';
import { CreatePersonalDto, UpdatePersonalDto } from './dto/personal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('personal')
@UseGuards(JwtAuthGuard)
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  @Post()
  create(@Request() req: any, @Body() createDto: CreatePersonalDto) {
    const clubId = req.user?.clubId || 'default-club-id';
    return this.personalService.create({ ...createDto, clubId });
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query('tipoPersonalId') tipoPersonalId?: string,
  ) {
    const clubId = req.user?.clubId || 'default-club-id';
    return this.personalService.findAll(
      clubId,
      tipoPersonalId ? +tipoPersonalId : undefined,
    );
  }

  @Get('activos')
  findAllActivos(
    @Request() req: any,
    @Query('tipoPersonalId') tipoPersonalId?: string,
  ) {
    const clubId = req.user?.clubId || 'default-club-id';
    return this.personalService.findAllActivos(
      clubId,
      tipoPersonalId ? +tipoPersonalId : undefined,
    );
  }

  @Get('disponibles')
  findDisponibles(
    @Request() req: any,
    @Query('tipoPersonalId') tipoPersonalId?: string,
  ) {
    const clubId = req.user?.clubId || 'default-club-id';
    return this.personalService.findDisponibles(
      clubId,
      tipoPersonalId ? +tipoPersonalId : undefined,
    );
  }

  @Get('tipo/:codigo')
  findByTipo(@Request() req: any, @Param('codigo') codigo: string) {
    const clubId = req.user?.clubId || 'default-club-id';
    return this.personalService.findByTipo(clubId, codigo);
  }

  @Get('estadisticas')
  getEstadisticas(@Request() req: any) {
    const clubId = req.user?.clubId || 'default-club-id';
    return this.personalService.getEstadisticas(clubId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personalService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdatePersonalDto) {
    return this.personalService.update(id, updateDto);
  }

  @Patch(':id/estado')
  updateEstado(
    @Param('id') id: string,
    @Body('estado') estado: 'disponible' | 'ocupado' | 'descanso' | 'inactivo',
  ) {
    return this.personalService.updateEstado(id, estado);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personalService.remove(id);
  }

  @Patch(':id/soft-delete')
  softDelete(@Param('id') id: string) {
    return this.personalService.softDelete(id);
  }
}
