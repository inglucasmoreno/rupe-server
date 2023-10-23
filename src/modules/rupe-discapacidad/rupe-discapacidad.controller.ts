import { Body, Controller, Get, HttpStatus, Param, Post, Query, Headers, Res, UseGuards, Patch } from '@nestjs/common';
import { RupeDiscapacidadService } from './rupe-discapacidad.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('rupe-discapacidad')
export class RupeDiscapacidadController {

  constructor(private readonly rupesService: RupeDiscapacidadService) { }

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
    @Body() createData: Prisma.RupeDiscapacidadCreateInput,
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
  async updateRupe(@Res() res, @Param('id') id: number, @Body() updateData:Prisma.RupeDiscapacidadUpdateInput): Promise<any> {

    const rupe = await this.rupesService.update(id, updateData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'RUPE actualizado correctamente',
      rupe
    })

  }
}
