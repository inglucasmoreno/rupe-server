import { Module } from '@nestjs/common';
import { RupeConductoresController } from './rupe-conductores.controller';
import { RupeConductoresService } from './rupe-conductores.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RupeConductoresController],
  providers: [RupeConductoresService, PrismaService]
})
export class RupeConductoresModule {}
