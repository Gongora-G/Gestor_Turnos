import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SociosService } from './socios.service';
import { SociosController } from './socios.controller';
import { Socio } from './entities/socio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Socio])],
  controllers: [SociosController],
  providers: [SociosService],
  exports: [SociosService],
})
export class SociosModule {}