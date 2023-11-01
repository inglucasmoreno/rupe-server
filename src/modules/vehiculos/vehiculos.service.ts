import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Vehiculos } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class VehiculosService {

  constructor(private prisma: PrismaService) { }

  // Vehiculo por ID
  async getId(id: number): Promise<Vehiculos> {

    const vehiculo = await this.prisma.vehiculos.findFirst({
      where: { id },
      include: {
        creatorUser: true,
      }
    })

    if (!vehiculo) throw new NotFoundException('El vehiculo no existe');
    return vehiculo;

  }

  // Vehiculo por Dominio
  async getDominio(dominio: string): Promise<Vehiculos> {

    // Sanitizacion de dominio
    dominio = dominio?.replace('-', '').replace(' ', '').trim();

    const vehiculo = await this.prisma.vehiculos.findFirst({
      where: { dominio },
      include: {
        creatorUser: true,
      }
    })

    if (!vehiculo) throw new NotFoundException('El vehiculo no existe');
    return vehiculo;

  }

  // Listar vehiculos
  async getAll({
    columna = 'dominio',
    direccion = 'desc',
    activo = '',
    parametro = '',
    pagina = 1,
    itemsPorPagina = 10000
  }: any): Promise<any> {

    // Ordenando datos
    let orderBy = {};
    orderBy[columna] = direccion;

    // let where: any = {
    //   OR: [],
    //   activo: activo === 'true' ? true : false
    // };

    let where: any = {
      OR: [],
    };

    where.OR.push({
      marca: {
        contains: parametro.toUpperCase()
      }
    })

    where.OR.push({
      modelo: {
        contains: parametro.toUpperCase()
      }
    })

    where.OR.push({
      dominio: {
        contains: parametro.toUpperCase()
      }
    })

    // if (createdAt) {
    //   where.OR.push({
    //     createdAt: {
    //       gte: new Date(createdAt),
    //     }
    //   });
    // }

    // Total de vehiculos
    const totalItems = await this.prisma.vehiculos.count({ where });

    // Listado de vehiculos
    const vehiculos = await this.prisma.vehiculos.findMany({
      take: Number(itemsPorPagina),
      include: {
        creatorUser: true,
      },
      skip: (pagina - 1) * itemsPorPagina,
      orderBy,
      where
    })

    return {
      vehiculos,
      totalItems,
    };

  }

  // Crear vehiculo
  async insert(createData: Prisma.VehiculosCreateInput): Promise<Vehiculos> {

    // Uppercase
    createData.marca = createData.marca?.toLocaleUpperCase().trim();
    createData.modelo = createData.modelo?.toLocaleUpperCase().trim();
    createData.dominio = createData.dominio?.toLocaleUpperCase().trim();

    // Sanitizacion de dominio
    createData.dominio = createData.dominio?.replace('-', '').replace(' ', '').trim();

    // Verificacion: Dominio repetido
    let vehiculoDB = await this.prisma.vehiculos.findFirst({ where: { dominio: createData.dominio } });
    if (vehiculoDB) throw new NotFoundException('El dominio ya fue cargado');

    return await this.prisma.vehiculos.create({ data: createData, include: { creatorUser: true } });

  }

  // Actualizar vehiculo
  async update(id: number, updateData: Prisma.VehiculosUpdateInput): Promise<Vehiculos> {

    console.log(updateData);

    const { dominio } = updateData;

    // Uppercase
    updateData.marca = updateData.marca?.toString().toLocaleUpperCase().trim();
    updateData.modelo = updateData.modelo?.toString().toLocaleUpperCase().trim();
    updateData.dominio = updateData.dominio?.toString().toLocaleUpperCase().trim();

    // Sanitizacion de dominio
    updateData.dominio = updateData.dominio?.replace('-', '').replace(' ', '').trim();

    const vehiculoDB = await this.prisma.vehiculos.findFirst({ where: { id } });

    // Verificacion: La vehiculo no existe
    if (!vehiculoDB) throw new NotFoundException('El vehiculo no existe');

    // Verificacion: Dominio repetido
    if (dominio) {
      const dominioRepetido = await this.prisma.vehiculos.findFirst({ where: { dominio: updateData.dominio.toString() } })
      if (dominioRepetido && dominioRepetido.id !== id) throw new NotFoundException('El dominio ya se encuentra cargado');
    }

    return await this.prisma.vehiculos.update({
      where: { id },
      data: updateData,
      include: {
        creatorUser: true
      }
    })

  }

}
