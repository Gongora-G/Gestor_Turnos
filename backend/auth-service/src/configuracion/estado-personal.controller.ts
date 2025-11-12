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
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EstadoPersonalService } from './estado-personal.service';
import { CreateEstadoPersonalDto } from './dto/create-estado-personal.dto';
import { UpdateEstadoPersonalDto } from './dto/update-estado-personal.dto';

@Controller('estados-personal')
@UseGuards(JwtAuthGuard)
export class EstadoPersonalController {
  constructor(private readonly estadoPersonalService: EstadoPersonalService) {}

  @Post()
  create(@Request() req, @Body() createDto: CreateEstadoPersonalDto) {
    return this.estadoPersonalService.create(req.user.clubId, createDto);
  }

  @Get()
  findAll(@Request() req, @Query('soloActivos') soloActivos?: string) {
    return this.estadoPersonalService.findAll(
      req.user.clubId,
      soloActivos === 'true',
    );
  }

  @Get(':id')
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.estadoPersonalService.findOne(req.user.clubId, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEstadoPersonalDto,
  ) {
    return this.estadoPersonalService.update(req.user.clubId, id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.estadoPersonalService.remove(req.user.clubId, id);
  }

  @Patch(':id/toggle-activo')
  toggleActivo(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.estadoPersonalService.toggleActivo(req.user.clubId, id);
  }

  @Post('inicializar')
  inicializar(@Request() req) {
    return this.estadoPersonalService.inicializarEstadosSistema(req.user.clubId);
  }
}
