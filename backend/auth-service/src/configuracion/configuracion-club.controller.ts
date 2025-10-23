import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ConfiguracionClubService } from './configuracion-club.service';
import { UpdateConfiguracionClubDto } from './dto/configuracion-club.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('configuracion')
@UseGuards(JwtAuthGuard)
export class ConfiguracionClubController {
  constructor(private readonly configuracionService: ConfiguracionClubService) {}

  @Get()
  findByClub(@Request() req) {
    return this.configuracionService.findByClub(req.user.clubId);
  }

  @Patch()
  update(@Body() updateDto: UpdateConfiguracionClubDto, @Request() req) {
    return this.configuracionService.update(updateDto, req.user.clubId);
  }

  @Get('horarios')
  getHorarios(@Request() req) {
    return this.configuracionService.getHorarios(req.user.clubId);
  }

  @Get('mantenimiento')
  isMantenimiento(@Request() req) {
    return this.configuracionService.isMantenimientoActivo(req.user.clubId);
  }
}