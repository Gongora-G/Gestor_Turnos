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
import { CaddiesService } from './caddies.service';
import { CreateCaddieDto } from './dto/create-caddie.dto';
import { UpdateCaddieDto } from './dto/update-caddie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('caddies')
@UseGuards(JwtAuthGuard)
export class CaddiesController {
  constructor(private readonly caddiesService: CaddiesService) {}

  @Post()
  create(@Body() createCaddieDto: CreateCaddieDto) {
    return this.caddiesService.create(createCaddieDto);
  }

  @Get()
  findAll(@Query('clubId') clubId?: string) {
    return this.caddiesService.findAll(clubId);
  }

  @Get('disponibles')
  findAvailable(
    @Query('clubId') clubId: string,
    @Query('fecha') fecha: string,
    @Query('horaInicio') horaInicio: string,
    @Query('horaFin') horaFin: string,
  ) {
    return this.caddiesService.findAvailableByDateTime(clubId, fecha, horaInicio, horaFin);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.caddiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCaddieDto: UpdateCaddieDto) {
    return this.caddiesService.update(id, updateCaddieDto);
  }

  @Patch(':id/estado')
  updateEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.caddiesService.updateEstado(id, estado);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.caddiesService.remove(id);
  }
}