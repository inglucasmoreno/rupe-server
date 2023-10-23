import { Module } from '@nestjs/common';
import { UsuariosPermisosController } from './usuarios-permisos.controller';
import { UsuariosPermisosService } from './usuarios-permisos.service';

@Module({
  imports: [],
  controllers: [UsuariosPermisosController],
  providers: [UsuariosPermisosService]
})
export class UsuariosPermisosModule {}
