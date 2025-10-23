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
  ParseUUIDPipe,
} from '@nestjs/common';
import { TipoMembresiaService } from './tipo-membresia.service';
import { CreateTipoMembresiaDto, UpdateTipoMembresiaDto } from './dto/tipo-membresia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tipos-membresia')
@UseGuards(JwtAuthGuard)
export class TipoMembresiaController {
  constructor(private readonly tipoMembresiaService: TipoMembresiaService) {}

  @Post()
  create(@Body() createDto: CreateTipoMembresiaDto, @Request() req) {
    return this.tipoMembresiaService.create(createDto, req.user.clubId);
  }

  @Get()
  findAll(@Request() req) {
    return this.tipoMembresiaService.findAllByClub(req.user.clubId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.tipoMembresiaService.findOne(id, req.user.clubId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateTipoMembresiaDto,
    @Request() req,
  ) {
    return this.tipoMembresiaService.update(id, updateDto, req.user.clubId);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.tipoMembresiaService.remove(id, req.user.clubId);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.tipoMembresiaService.toggleActive(id, req.user.clubId);
  }
}