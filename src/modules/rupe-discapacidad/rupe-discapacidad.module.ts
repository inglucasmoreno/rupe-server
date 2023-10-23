import { Module } from '@nestjs/common';
import { RupeDiscapacidadController } from './rupe-discapacidad.controller';
import { RupeDiscapacidadService } from './rupe-discapacidad.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RupeDiscapacidadController],
  providers: [RupeDiscapacidadService, PrismaService]
})
export class RupeDiscapacidadModule {}
