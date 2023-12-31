import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RupeConductores } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RupeConductoresService {

  constructor(private prisma: PrismaService) { }

  // Conductores por ID
  async getId(id: number): Promise<RupeConductores> {

    const rupe = await this.prisma.rupeConductores.findFirst({
      where: { id },
      include: {
        persona: true,
        rupeConductorDiscapacitado: true,
        creatorUser: true,
      }
    })

    if (!rupe) throw new NotFoundException('El Conductor no existe');
    return rupe;

  }

  // Listar conductores
  async getAll({
    columna = 'createdAt',
    direccion = 'desc',
    activo = '',
    parametro = '',
    rupe = '',
    pagina = 1,
    itemsPorPagina = 10000
  }: any): Promise<any> {

    // Ordenando datos
    let orderBy = {};
    orderBy[columna] = direccion;

    // Filtrando datos
    // let where = [];
    // let campos = ['descripcion'];

    // campos.forEach( campo => {
    //   const filtro = {};
    //   filtro[campo] = Like('%' + parametro.toUpperCase() + '%');
    //   if(activo.trim() !== '') filtro['activo'] = activo === 'true' ? true : false;
    //   where.push(filtro)
    // })

    // const totalItems = await this.productosRepository.count({where});

    // let where: any = {
    //   OR: [],
    //   activo: activo === 'true' ? true : false
    // };

    let where: any = {
      rupeConductorDiscapacitadoId: Number(rupe)
    };

    // where.apellido ={ contains: parametro.toUpperCase() }

    // where.OR.push({
    //   apellido: {
    //     contains: parametro.toUpperCase()
    //   }
    // })

    // where.OR.push({
    //   nombre: {
    //     contains: parametro.toUpperCase()
    //   }
    // })

    // where.OR.push({
    //   dni: {
    //     contains: parametro.toUpperCase()
    //   }
    // })

    // if (createdAt) {
    //   where.OR.push({
    //     createdAt: {
    //       gte: new Date(createdAt),
    //     }
    //   });
    // }

    // if (activo) where = { activo: activo === 'true' ? true : false };

    // Total de conductores
    const totalItems = await this.prisma.rupeConductores.count({ where });

    // Listado de conductores
    const conductores = await this.prisma.rupeConductores.findMany({
      include: {
        persona: true,
        rupeConductorDiscapacitado: true,
        creatorUser: true,
      },
      take: Number(itemsPorPagina),
      skip: (pagina - 1) * itemsPorPagina,
      orderBy,
      where
    })
    return {
      conductores,
      totalItems,
    };

  }

  // Crear conductor
  async insert(createData: any): Promise<RupeConductores> {

    // Verifiacion - El conductor ya esta cartado en este RUPE
    const existe = await this.prisma.rupeConductores.findFirst({
      where: {
        rupeConductorDiscapacitadoId: createData.rupeConductorDiscapacitadoId,
        personaId: createData.personaId
      }
    });

    if(existe) throw new NotFoundException('El conductor ya esta cargado en este RUPE');

    // Verificacion - No pueden haber mas de 3 conductores en un RUPE
    const cantidad = await this.prisma.rupeConductores.count({
      where: {
        rupeConductorDiscapacitadoId: createData.rupeConductorDiscapacitadoId
      }
    });

    if(cantidad >= 3) throw new NotFoundException('No pueden haber mas de 3 conductores en un RUPE');

    return await this.prisma.rupeConductores.create({
      data: createData, include: {
        persona: true,
        rupeConductorDiscapacitado: true,
        creatorUser: true
      }
    });
  }

  // Actualizar conductores
  async update(id: number, updateData: Prisma.RupeConductoresUpdateInput): Promise<RupeConductores> {
    return await this.prisma.rupeConductores.update({
      where: { id },
      data: updateData,
      include: {
        persona: true,
        rupeConductorDiscapacitado: true,
        creatorUser: true
      }
    })
  }

  // Eliminar conductor
  async delete(id: number): Promise<RupeConductores> {
    return await this.prisma.rupeConductores.delete({
      where: { id },
      include: {
        persona: true,
        rupeConductorDiscapacitado: true,
        creatorUser: true
      }
    })
  }

}
