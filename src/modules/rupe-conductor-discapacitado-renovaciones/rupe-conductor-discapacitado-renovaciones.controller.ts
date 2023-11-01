import { Body, Controller, Get, HttpStatus, Param, Post, Headers, Query, Res, UseGuards, Patch } from '@nestjs/common';
import { RupeConductorDiscapacitadoRenovacionesService } from './rupe-conductor-discapacitado-renovaciones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('rupe-conductor-discapacitado-renovaciones')
export class RupeConductorDiscapacitadoRenovacionesController {

  constructor(private readonly renovacionesService: RupeConductorDiscapacitadoRenovacionesService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getIdRenovacion(@Res() res, @Param('id') id: number): Promise<any> {

    const rupe = await this.renovacionesService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Renovacion obtenida correctamente',
      rupe
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllRenovaciones(@Res() res, @Query() query): Promise<any> {
    const { renovaciones, totalItems } = await this.renovacionesService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Renovaciones obtenidas correctamente',
      renovaciones,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async insertRenovacion(
    @Res() res,
    @Body() createData: Prisma.RupeConductorDiscapacitadoRenovacionesCreateInput,
    @Headers('userLogin') userLogin: any
  ): Promise<any> {

    const data = {
      ...createData,
      creatorUserId: Number(userLogin),
    }

    const { renovacion, rupe } = await this.renovacionesService.insert(data);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Renovacion creada correctamente',
      renovacion,
      rupe
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateRenovacion(@Res() res, @Param('id') id: number, @Body() updateData:Prisma.RupeConductorDiscapacitadoRenovacionesUpdateInput): Promise<any> {

    const renovacion = await this.renovacionesService.update(id, updateData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Renovacion actualizada correctamente',
      renovacion
    })

  }

}
