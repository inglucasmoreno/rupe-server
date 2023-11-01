import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RupeDiscapacidad } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RupeDiscapacidadService {

  constructor(private prisma: PrismaService) { }

  // RUPE por ID
  async getId(id: number): Promise<RupeDiscapacidad> {

    const rupe = await this.prisma.rupeDiscapacidad.findFirst({
      where: { id },
      include: {
        beneficiario: true,
        vehiculo: true,
        creatorUser: true,
      }
    })

    if (!rupe) throw new NotFoundException('El RUPE no existe');
    return rupe;

  }

  // Listar RUPES
  async getAll({
    columna = 'createdAt',
    direccion = 'desc',
    activo = '',
    parametro = '',
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

    let where: any = {};
    
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

    // Total de RUPES
    const totalItems = await this.prisma.rupeDiscapacidad.count({ where });

    // Listado de RUPES
    const rupes = await this.prisma.rupeDiscapacidad.findMany({
      include: {
        beneficiario: true,
        vehiculo: true,
        creatorUser: true,
      },
      take: Number(itemsPorPagina),
      skip: (pagina - 1) * itemsPorPagina,
      orderBy,
      where
    })
    return {
      rupes,
      totalItems,
    };

  }

  // Crear RUPE
  async insert(createData: any): Promise<RupeDiscapacidad> {

    // Verificacion - Ya existe un rupe con este beneficiario
    
    const rupe = await this.prisma.rupeDiscapacidad.findFirst({
      where: {
        beneficiarioId: createData.beneficiarioId
      }
    })
    
    if(rupe) throw new NotFoundException('Ya existe un RUPE para este beneficiario');

    const data = {
      ...createData,
      fechaOtorgamiento: new Date(),
      fechaVencimiento: new Date(new Date().setMonth(new Date().getMonth() + 6))
    }

    return await this.prisma.rupeDiscapacidad.create({ 
      data,
      include: { 
        beneficiario: true,
        vehiculo: true,
        creatorUser: true 
      } });
      
  }

  // Actualizar RUPE
  async update(id: number, updateData: Prisma.RupeDiscapacidadUpdateInput): Promise<RupeDiscapacidad> {
    return await this.prisma.rupeDiscapacidad.update({
      where: { id },
      data: updateData,
      include: {
        beneficiario: true,
        vehiculo: true,
        creatorUser: true,
      }
    })
  }

}
