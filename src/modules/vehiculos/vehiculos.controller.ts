import { Body, Controller, Get, HttpStatus, Param, Post, Headers, Query, Res, UseGuards, Patch } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('vehiculos')
export class VehiculosController {

  constructor(private readonly vehiculosService: VehiculosService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getIdVehiculo(@Res() res, @Param('id') id: number): Promise<any> {

    const vehiculo = await this.vehiculosService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Vehiculo obtenido correctamente',
      vehiculo
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/parametro/dominio/:dominio')
  async getDominioVehiculo(@Res() res, @Param('dominio') dominio: string): Promise<any> {

    const vehiculo = await this.vehiculosService.getDominio(dominio);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Vehiculo obtenido correctamente',
      vehiculo
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllVehiculos(@Res() res, @Query() query): Promise<any> {
    const { vehiculos, totalItems } = await this.vehiculosService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Vehiculos obtenidos correctamente',
      vehiculos,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async insertVehiculo(
    @Res() res,
    @Body() createData: Prisma.VehiculosCreateInput,
    @Headers('userLogin') userLogin: any
  ): Promise<any> {

    const data = {
      ...createData,
      creatorUserId: Number(userLogin),
    }

    const vehiculo = await this.vehiculosService.insert(data);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Vehiculo creado correctamente',
      vehiculo
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateVehiculo(@Res() res, @Param('id') id: number, @Body() updateData:Prisma.VehiculosUpdateInput): Promise<any> {

    const vehiculo = await this.vehiculosService.update(id, updateData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Vehiculo actualizado correctamente',
      vehiculo
    })

  }

}
