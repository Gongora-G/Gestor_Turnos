import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TiposPersonalService } from './tipos-personal.service';
import { CreateTipoPersonalDto, UpdateTipoPersonalDto } from './dto/tipo-personal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tipos-personal')
@UseGuards(JwtAuthGuard)
export class TiposPersonalController {
  constructor(private readonly tiposPersonalService: TiposPersonalService) {}

  @Post()
  create(@Request() req: any, @Body() createDto: CreateTipoPersonalDto) {
    const clubId = req.user?.clubId || 'default-club-id';
    return this.tiposPersonalService.create({ ...createDto, clubId });
  }

  @Get()
  findAll(@Request() req: any) {
    const clubId = req.user?.clubId || 'default-club-id';
    return this.tiposPersonalService.findAll(clubId);
  }

  @Get('activos')
  findAllActivos(@Request() req: any) {
    const clubId = req.user?.clubId || 'default-club-id';
    return this.tiposPersonalService.findAllActivos(clubId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposPersonalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateTipoPersonalDto) {
    return this.tiposPersonalService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiposPersonalService.remove(+id);
  }

  @Post('seed')
  crearTiposPorDefecto(@Request() req: any) {
    const clubId = req.user?.clubId || 'default-club-id';
    return this.tiposPersonalService.crearTiposPorDefecto(clubId);
  }
}
