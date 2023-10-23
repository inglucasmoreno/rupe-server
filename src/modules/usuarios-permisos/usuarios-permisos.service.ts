import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsuariosPermisosService {

  constructor() { }

  // Permiso por ID
  async getId(id: number): Promise<any> {

    // const permiso = await this.permisosRepository.findOne({ 
    //   relations: {
    //     usuario: true,
    //     creatorUser: true,
    //     updatorUser: true,
    //   }, 
    //   where: { id } 
    // });
    // if (!permiso) throw new NotFoundException('El permiso no existe');
    return { msg: 'getId' };

  }

  // Listar permisos
  async getAll({
    columna = 'id',
    direccion = 1,
    activo,
    usuario,
    desde = 0,
    cantidadItems = 100000
  }: any): Promise<any> {

    // Ordenando datos
    let order = {};
    order[columna] = Number(direccion);

    // Filtrando datos
    let where = [];

    // Filtro por usuario
    if(usuario && usuario !== ''){
      where.push({
        usuario: { id: Number(usuario) }
      })
    }

    // const totalItems = await this.permisosRepository.count({ where });

    // const permisos = await this.permisosRepository
    //   .find({
    //     relations: {
    //       usuario: true,
    //       creatorUser: true,
    //       updatorUser: true
    //     },
    //     order,
    //     skip: Number(desde),
    //     take: Number(cantidadItems),
    //     where
    //   });

    // return {
    //   permisos,
    //   totalItems
    // };

    return { msg: 'getAll' }

  }

  // Crear permiso
  async insert(permisosDTO: any): Promise<any> {

  //   const { usuario, alcance }  = permisosDTO;

  //   // Verificacion -> El permiso ya se encuentra cargado
  //   const permisoExiste = await this.permisosRepository.findOne({ 
  //     where: [ { usuario: { id: usuario }, alcance } ]
  //   });
  //   console.log(permisoExiste);
  //   if(permisoExiste) throw new NotFoundException('El permiso ya se encuentra cargado');

  //   const nuevoPermiso = await this.permisosRepository.create(permisosDTO);
  //   return this.permisosRepository.save(nuevoPermiso);
  }

  // Actualizar permiso
  async update(id: number, permisosUpdateDTO: any): Promise<any> {
    // await this.permisosRepository.update({ id }, permisosUpdateDTO);
    // return this.getId(id);
    return { message: 'Update' }
  }

  // Eliminar permiso
  async delete(id: number): Promise<any> {

  //   // Verificacion -> El permiso no existe
  //   const permisoExiste = await this.permisosRepository.findOne({ where: { id } });
  //   if(!permisoExiste) throw new NotFoundException('El permiso no existe');

  //   await this.permisosRepository.delete(id);
  //   return 'Permiso eliminado correctamente';
  
    return { msg: 'Delete' }
    
  }

}
