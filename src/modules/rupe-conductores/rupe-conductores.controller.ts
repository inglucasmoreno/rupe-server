import { Body, Controller, Get, HttpStatus, Param, Post, Headers, Query, Res, UseGuards, Patch } from '@nestjs/common';
import { RupeConductoresService } from './rupe-conductores.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('rupe-conductores')
export class RupeConductoresController {
  constructor(private readonly conductoresService: RupeConductoresService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getIdConductor(@Res() res, @Param('id') id: number): Promise<any> {

    const conductores = await this.conductoresService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Conductores obtenidos correctamente',
      conductores
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllConductores(@Res() res, @Query() query): Promise<any> {
    const { conductores, totalItems } = await this.conductoresService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Conductores obtenidos correctamente',
      conductores,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async insertConductor(
    @Res() res,
    @Body() createData: Prisma.RupeConductoresCreateInput,
    @Headers('userLogin') userLogin: any
  ): Promise<any> {

    const data = {
      ...createData,
      creatorUserId: Number(userLogin),
    }

    const conductor = await this.conductoresService.insert(data);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Conductor creado correctamente',
      conductor
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateConductor(@Res() res, @Param('id') id: number, @Body() updateData:Prisma.RupeConductoresUpdateInput): Promise<any> {

    const conductor = await this.conductoresService.update(id, updateData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Conductor actualizado correctamente',
      conductor
    })

  }
}
