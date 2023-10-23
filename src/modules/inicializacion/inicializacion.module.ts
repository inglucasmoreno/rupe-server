import { Module } from '@nestjs/common';
import { InicializacionController } from './inicializacion.controller';
import { InicializacionService } from './inicializacion.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [InicializacionController],
  providers: [InicializacionService, PrismaService]
})
export class InicializacionModule {}
