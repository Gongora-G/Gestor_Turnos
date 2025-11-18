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
import { CanchaService } from './cancha.service';
import { CreateCanchaDto, UpdateCanchaDto } from './dto/cancha.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('configuracion/canchas')
@UseGuards(JwtAuthGuard)
export class CanchaController {
  constructor(private readonly canchaService: CanchaService) {}

  @Post()
  create(@Body() createDto: CreateCanchaDto, @Request() req) {
    return this.canchaService.create(createDto, req.user.clubId);
  }

  @Get()
  findAll(@Request() req) {
    return this.canchaService.findAllByClub(req.user.clubId);
  }

  @Get('active')
  findActive(@Request() req) {
    return this.canchaService.findActiveByClub(req.user.clubId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.canchaService.findOne(id, req.user.clubId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateCanchaDto,
    @Request() req,
  ) {
    return this.canchaService.update(id, updateDto, req.user.clubId);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.canchaService.remove(id, req.user.clubId);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.canchaService.toggleActive(id, req.user.clubId);
  }
}