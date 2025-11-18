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
import { TipoSuperficieCanchaService } from './tipo-superficie-cancha.service';
import { CreateTipoSuperficieCanchaDto, UpdateTipoSuperficieCanchaDto } from './dto/tipo-superficie-cancha.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('configuracion/tipos-superficie')
@UseGuards(JwtAuthGuard)
export class TipoSuperficieCanchaController {
  constructor(private readonly tipoSuperficieService: TipoSuperficieCanchaService) {}

  @Post()
  create(@Body() createDto: CreateTipoSuperficieCanchaDto, @Request() req) {
    return this.tipoSuperficieService.create(createDto, req.user.clubId);
  }

  @Get()
  findAll(@Request() req) {
    return this.tipoSuperficieService.findAllByClub(req.user.clubId);
  }

  @Get('active')
  findActive(@Request() req) {
    return this.tipoSuperficieService.findActiveByClub(req.user.clubId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tipoSuperficieService.findOne(id, req.user.clubId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTipoSuperficieCanchaDto,
    @Request() req,
  ) {
    return this.tipoSuperficieService.update(id, updateDto, req.user.clubId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tipoSuperficieService.remove(id, req.user.clubId);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tipoSuperficieService.toggleActive(id, req.user.clubId);
  }
}
