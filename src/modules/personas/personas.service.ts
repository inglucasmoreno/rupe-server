import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Personas } from '@prisma/client';

@Injectable()
export class PersonasService {

  constructor(private prisma: PrismaService) { }

  // Persona por ID
  async getId(id: number): Promise<Personas> {

    const persona = await this.prisma.personas.findFirst({
      where: { id },
      include: {
        creatorUser: true,
      }
    })

    if (!persona) throw new NotFoundException('La persona no existe');
    return persona;

  }

  // Listar personas
  async getAll({
    columna = 'apellido',
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

    let where: any = {
      OR: []
    };
    
    // where.apellido ={ contains: parametro.toUpperCase() }

    where.OR.push({
      apellido: {
        contains: parametro.toUpperCase()
      }
    })

    where.OR.push({
      nombre: {
        contains: parametro.toUpperCase()
      }
    })

    where.OR.push({
      dni: {
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

    // if (activo) where = { activo: activo === 'true' ? true : false };

    // Total de personas
    const totalItems = await this.prisma.personas.count({ where });

    // Listado de personas
    const personas = await this.prisma.personas.findMany({
      take: Number(itemsPorPagina),
      include: {
        creatorUser: true,
      },
      skip: (pagina - 1) * itemsPorPagina,
      orderBy,
      where
    })

    return {
      personas,
      totalItems,
    };

  }

  // Crear persona
  async insert(createData: Prisma.PersonasCreateInput): Promise<Personas> {

    const { dni } = createData;

    // Uppercase
    createData.apellido = createData.apellido?.toLocaleUpperCase().trim();
    createData.nombre = createData.nombre?.toLocaleUpperCase().trim();
    createData.discapacidad = String(createData.discapacidad) === 'true' ? true : false;

    // Verificacion: Campos obligatorios

    // Verificacion: DNI repetido
    let personaDB = await this.prisma.personas.findFirst({ where: { dni } });
    if (personaDB) throw new NotFoundException('El DNI ya fue cargado');

    return await this.prisma.personas.create({ data: createData, include: { creatorUser: true } });

  }

  // Actualizar persona
  async update(id: number, updateData: Prisma.PersonasUpdateInput): Promise<Personas> {

    const { dni } = updateData;

    // Uppercase
    updateData.apellido = updateData.apellido?.toString().toLocaleUpperCase().trim();
    updateData.nombre = updateData.nombre?.toString().toLocaleUpperCase().trim();
    updateData.discapacidad = String(updateData.discapacidad) === 'true' ? true : false;

    const personaDB = await this.prisma.personas.findFirst({ where: { id } });

    // Verificacion: La persona no existe
    if (!personaDB) throw new NotFoundException('La persona no existe');

    // Verificacion: DNI repetido
    if (dni) {
      const dniRepetido = await this.prisma.personas.findFirst({ where: { dni: dni.toString() } })
      if (dniRepetido && dniRepetido.id !== id) throw new NotFoundException('El DNI ya se encuentra cargado');
    }

    return await this.prisma.personas.update({
      where: { id },
      data: updateData,
      include: {
        creatorUser: true
      }
    })

  }

}
