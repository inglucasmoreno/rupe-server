import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { UsuariosPermisosService } from './usuarios-permisos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsuariosPermisosDTO } from './dto';

@Controller('usuarios-permisos')
export class UsuariosPermisosController {

  constructor(private readonly permisosService: UsuariosPermisosService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async permisoPorId(@Res() res, @Param('id') id: number): Promise<any> {

    const permiso = await this.permisosService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Permiso obtenido correctamente',
      permiso
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async listarPermisos(@Res() res, @Query() query): Promise<any> {
    const { permisos, totalItems } = await this.permisosService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Permisos obtenidos correctamente',
      permisos,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async crearPermiso(@Res() res, @Body() permisosDTO: UsuariosPermisosDTO): Promise<any> {

    const permiso = await this.permisosService.insert(permisosDTO);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Permiso creado correctamente',
      permiso
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async actualizarPermiso(@Res() res, @Param('id') id: number, @Body() permisosUpdateDTO: any) {

    const permiso = await this.permisosService.update(id, permisosUpdateDTO);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Permiso actualizado correctamente',
      permiso
    })

  } 
  
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async eliminarPermiso(@Res() res, @Param('id') id: number) {

    await this.permisosService.delete(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Permiso eliminado correctamente'
    })

  } 

}
