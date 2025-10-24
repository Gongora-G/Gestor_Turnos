import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JornadasController } from './jornadas.controller';
import { JornadasService } from './jornadas.service';
import { JornadaTurno } from './entities/jornada-turno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JornadaTurno])],
  controllers: [JornadasController],
  providers: [JornadasService],
  exports: [JornadasService],
})
export class JornadasModule {}