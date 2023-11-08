import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res, Headers, UseGuards, Patch } from '@nestjs/common';
import { RupeConductorDiscapacitadoService } from './rupe-conductor-discapacitado.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('rupe-conductor-discapacitado')
export class RupeConductorDiscapacitadoController {

  constructor(private readonly rupesService: RupeConductorDiscapacitadoService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getIdRupe(@Res() res, @Param('id') id: number): Promise<any> {

    const rupe = await this.rupesService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'RUPE obtenido correctamente',
      rupe
    })

  }

  @Get('/imprimir-oblea/:id')
  async imprimirOblea(@Res() res, @Param('id') id: number): Promise<void> {

    const buffer = await this.rupesService.generarOblea(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename-example.pdf',
      'Content-Length': buffer.length
    })

    res.end(buffer);

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllRupes(@Res() res, @Query() query): Promise<any> {
    const { rupes, totalItems } = await this.rupesService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'RUPES obtenidos correctamente',
      rupes,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async insertRupe(
    @Res() res,
    @Body() createData: Prisma.RupeConductorDiscapacitadoCreateInput,
    @Headers('userLogin') userLogin: any
  ): Promise<any> {

    const data = {
      ...createData,
      creatorUserId: Number(userLogin),
    }

    const rupe = await this.rupesService.insert(data);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'RUPE creada correctamente',
      rupe
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateRupe(@Res() res, @Param('id') id: number, @Body() updateData: Prisma.RupeConductorDiscapacitadoUpdateInput): Promise<any> {

    const rupe = await this.rupesService.update(id, updateData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'RUPE actualizado correctamente',
      rupe
    })

  }

}
