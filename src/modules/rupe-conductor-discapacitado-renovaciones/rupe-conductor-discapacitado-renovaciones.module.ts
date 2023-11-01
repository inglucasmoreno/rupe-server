import { Module } from '@nestjs/common';
import { RupeConductorDiscapacitadoRenovacionesController } from './rupe-conductor-discapacitado-renovaciones.controller';
import { RupeConductorDiscapacitadoRenovacionesService } from './rupe-conductor-discapacitado-renovaciones.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RupeConductorDiscapacitadoRenovacionesController],
  providers: [RupeConductorDiscapacitadoRenovacionesService, PrismaService]
})
export class RupeConductorDiscapacitadoRenovacionesModule {}
