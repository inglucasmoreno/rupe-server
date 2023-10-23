import { Module } from '@nestjs/common';
import { RupeConductorDiscapacitadoService } from './rupe-conductor-discapacitado.service';
import { RupeConductorDiscapacitadoController } from './rupe-conductor-discapacitado.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RupeConductorDiscapacitadoController],
  providers: [RupeConductorDiscapacitadoService, PrismaService]
})
export class RupeConductorDiscapacitadoModule {}
