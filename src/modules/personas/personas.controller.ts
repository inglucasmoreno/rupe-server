import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res, Headers, UseGuards, Patch } from '@nestjs/common';
import { PersonasService } from './personas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('personas')
export class PersonasController {

  constructor(private readonly personasService: PersonasService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getIdPersona(@Res() res, @Param('id') id: number): Promise<any> {

    const persona = await this.personasService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Persona obtenida correctamente',
      persona
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllPersonas(@Res() res, @Query() query): Promise<any> {
    console.log(query);
    const { personas, totalItems } = await this.personasService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Personas obtenidas correctamente',
      personas,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async insertPersona(
    @Res() res,
    @Body() createData: Prisma.PersonasCreateInput,
    @Headers('userLogin') userLogin: any
  ): Promise<any> {

    const data = {
      ...createData,
      creatorUserId: Number(userLogin),
    }

    const persona = await this.personasService.insert(data);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Persona creada correctamente',
      persona
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updatePersona(@Res() res, @Param('id') id: number, @Body() updateData:Prisma.PersonasUpdateInput): Promise<any> {

    const persona = await this.personasService.update(id, updateData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Persona actualizada correctamente',
      persona
    })

  }

}
