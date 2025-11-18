import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { EstadoCanchaService } from './estado-cancha.service';
import { CreateEstadoCanchaDto, UpdateEstadoCanchaDto } from './dto/estado-cancha.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('configuracion/estados-cancha')
@UseGuards(JwtAuthGuard)
export class EstadoCanchaController {
  constructor(private readonly estadoCanchaService: EstadoCanchaService) {}

  @Post()
  create(@Body() createDto: CreateEstadoCanchaDto, @Request() req) {
    return this.estadoCanchaService.create(createDto, req.user.clubId);
  }

  @Get()
  findAll(@Request() req) {
    return this.estadoCanchaService.findAllByClub(req.user.clubId);
  }

  @Get('active')
  findActive(@Request() req) {
    return this.estadoCanchaService.findActiveByClub(req.user.clubId);
  }

  @Get('predeterminado')
  getPredeterminado(@Request() req) {
    return this.estadoCanchaService.getEstadoPredeterminado(req.user.clubId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.estadoCanchaService.findOne(id, req.user.clubId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEstadoCanchaDto,
    @Request() req,
  ) {
    return this.estadoCanchaService.update(id, updateDto, req.user.clubId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.estadoCanchaService.remove(id, req.user.clubId);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.estadoCanchaService.toggleActive(id, req.user.clubId);
  }
}
