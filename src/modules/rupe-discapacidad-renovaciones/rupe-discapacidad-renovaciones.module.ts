import { Module } from '@nestjs/common';
import { RupeDiscapacidadRenovacionesController } from './rupe-discapacidad-renovaciones.controller';
import { RupeDiscapacidadRenovacionesService } from './rupe-discapacidad-renovaciones.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RupeDiscapacidadRenovacionesController],
  providers: [RupeDiscapacidadRenovacionesService, PrismaService]
})
export class RupeDiscapacidadRenovacionesModule {}
