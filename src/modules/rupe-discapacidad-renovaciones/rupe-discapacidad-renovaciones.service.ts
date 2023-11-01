import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RupeDiscapacidadRenovaciones } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RupeDiscapacidadRenovacionesService {

  constructor(private prisma: PrismaService) { }

  // Renovacion por ID
  async getId(id: number): Promise<RupeDiscapacidadRenovaciones> {

    const renovacion = await this.prisma.rupeDiscapacidadRenovaciones.findFirst({
      where: { id },
      include: {
        creatorUser: true,
      }
    })

    if (!renovacion) throw new NotFoundException('La renovacion no existe');
    return renovacion;

  }

  // Listar renovaciones
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

    let where: any = { rupeDiscapacidadId: Number(rupe) };
  
    // Total de renovaciones
    const totalItems = await this.prisma.rupeDiscapacidadRenovaciones.count({ where });

    // Listado de renovaciones
    const renovaciones = await this.prisma.rupeDiscapacidadRenovaciones.findMany({
      take: Number(itemsPorPagina),
      include: {
        creatorUser: true,
      },
      skip: (pagina - 1) * itemsPorPagina,
      orderBy,
      where
    })

    return {
      renovaciones,
      totalItems,
    };

  }

  // Crear renovacion
  async insert(createData: any): Promise<any> {

    // Actualizacion de RUPE
    const rupe = await this.prisma.rupeDiscapacidad.update({
      where: { id: createData.rupeDiscapacidadId },
      data: {
        fechaOtorgamiento: new Date(),
        fechaVencimiento: new Date(new Date().setMonth(new Date().getMonth() + 6))
      },
      include: {
        beneficiario: true,
        vehiculo: true,
        creatorUser: true 
      }
    })

    // Creacion de renovacion
    const renovacion = await this.prisma.rupeDiscapacidadRenovaciones.create({ data: createData, include: { creatorUser: true } });
    
    return {
      rupe,
      renovacion
    }
  
  }

  // Actualizar renovacion
  async update(id: number, updateData: Prisma.RupeDiscapacidadRenovacionesUpdateInput): Promise<RupeDiscapacidadRenovaciones> {

    const renovacionDB = await this.prisma.rupeDiscapacidadRenovaciones.findFirst({ where: { id } });

    // Verificacion: La renovacion no existe
    if (!renovacionDB) throw new NotFoundException('La renovacion no existe');

    return await this.prisma.rupeDiscapacidadRenovaciones.update({
      where: { id },
      data: updateData,
      include: {
        creatorUser: true
      }
    })

  }

}
