import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RupeDiscapacidad } from '@prisma/client';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns';

@Injectable()
export class RupeDiscapacidadService {

  constructor(
    private readonly configService: ConfigService,
    private prisma: PrismaService
  ) { }

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

  // Imprimir oblea con makepdf
  async generarOblea(id: number): Promise<any> {

    const rupe = await this.prisma.rupeDiscapacidad.findFirst({
      where: { id },
      include: {
        beneficiario: true,
        vehiculo: true,
        creatorUser: true,
      }
    })

    if (!rupe) throw new NotFoundException('El RUPE no existe');

    const pdfBuffer: Buffer = await new Promise(resolve => {

      var fonts = {
        Helvetica: {
          normal: 'Helvetica',
          bold: 'Helvetica-Bold',
          italics: 'Helvetica-Oblique',
          bolditalics: 'Helvetica-BoldOblique'
        },
      };

      const printer = new PdfPrinter(fonts);

      const docDefinition: TDocumentDefinitions = {

        defaultStyle: { font: 'Helvetica' },

        content: [

          // Encabezado

          {

            columns: [
              {
                image: this.configService.get('NODE_ENV') === 'production' ? `../assets/logoMuni.png` : './assets/logoMuni.png',
                width: 140,
              },
              {
                text: `Libre Estacionamiento
                       Persona con
                       Discapacidad`,
                style: 'header'
              },
            ],
          },

          {
            text: [
              { text: `R.U.P.E N° `, bold: false },
              { text: `${rupe.id.toString().padStart(8, '0')}`, bold: true },
            ],
            style: 'headerText'
          },

          {
            text: [
              { text: `OBLEA ÚNICA`, bold: true },
            ],
            style: 'headerSubText'
          },

          {
            image: this.configService.get('NODE_ENV') === 'production' ? `../assets/logoDiscapacidad.png` : './assets/logoDiscapacidad.png',
            width: 330,
            style: {
              alignment: 'center',
              marginTop: 20,
            }
          },

          {
            text: [
              {
                text: `BENEFICIARIO / CONDUCTOR`,
                bold: false,
              },
            ],
            style: 'primerTituloFormulario'
          },

          {
            text: [
              {
                text: `${rupe.beneficiario.apellido}, ${rupe.beneficiario.nombre}`,
                bold: true,
              },
            ],
            style: 'campoFormulario'
          },

          {

            columns: [
              {
                text: [
                  {
                    text: `DNI BENEFICIARIO / CONDUCTOR`,
                    bold: false,
                  },
                ],
                style: 'primerTituloFormulario'
              },
              {
                text: [
                  {
                    text: `FECHA DE OTORGAMIENTO`,
                    bold: false,
                    style: {
                      alignment: 'right',
                    }
                  },
                ],
                style: 'primerTituloFormulario'
              }
            ],

          },

          {

            columns: [
              {
                text: [
                  {
                    text: `${rupe.beneficiario.dni}`,
                    bold: true,
                  },
                ],
                style: 'campoFormulario'
              },
              {
                text: [
                  {
                    text: `${format(new Date(rupe.fechaOtorgamiento), 'dd/MM/yyyy')}`,
                    bold: true,
                  },
                ],
                style: 'campoDerechaFormulario'
              }
            ],

          },

          {

            columns: [
              {
                text: [
                  {
                    text: `VEHÍCULO`,
                    bold: false,
                  },
                ],
                style: 'primerTituloFormulario'
              },
              {
                text: [
                  {
                    text: `FECHA DE VENCIMIENTO`,
                    bold: false,
                    style: {
                      alignment: 'right',
                    }
                  },
                ],
                style: 'fechaVencimiento'
              }
            ],

          },

          {

            columns: [
              {
                text: [
                  {
                    text: `${rupe.vehiculo.marca} ${rupe.vehiculo.modelo}`,
                    bold: true,
                  },
                ],
                style: 'campoFormulario'
              },
              {
                text: [
                  {
                    text: `${format(new Date(rupe.fechaVencimiento), 'dd/MM/yyyy')}`,
                    bold: true,
                  },
                ],
                style: 'campoDerechaFormulario'
              }
            ],

          },

          {

            columns: [
              {
                text: [
                  {
                    text: `DOMINIO`,
                    bold: false,
                  },
                ],
                style: 'primerTituloFormulario'
              },
              {
                text: [],
              }
            ],

          },

          {

            columns: [
              {
                text: [
                  {
                    text: `${rupe.vehiculo.dominio}`,
                    bold: true,
                  },
                ],
                style: 'campoFormulario'
              },
              {
                image: this.configService.get('NODE_ENV') === 'production' ? `../assets/firma.png` : './assets/firma.png',
                width: 120,
                style: 'firma'
              }
            ],

          },

        ],
        styles: {
          header: {
            fontSize: 28,
            bold: true,
            marginLeft: 50,
            marginTop: 20,
            lineHeight: 1.2,
          },
          headerText: {
            fontSize: 16,
            alignment: 'center',
          },
          headerSubText: {
            fontSize: 14,
            alignment: 'center',
            marginTop: 10,
          },
          primerTituloFormulario: {
            marginTop: 20,
          },
          campoFormulario: {
            fontSize: 18,
            bold: true,
            marginTop: 7,
          },
          campoDerechaFormulario: {
            alignment: 'right',
            fontSize: 18,
            marginRight: 72,
            marginTop: 10
          },
          fechaVencimiento: {
            marginTop: 20,
            marginRight: 14,
          },
          firma: {
            alignment: 'right',
            marginRight: 20
          }
        },

      }

      const pdfDoc = printer.createPdfKitDocument(docDefinition);

      const chunks = [];

      pdfDoc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      pdfDoc.end();

      pdfDoc.on("end", () => {
        const result = Buffer.concat(chunks);
        resolve(result)
      })

    })

    return pdfBuffer;

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

    if (rupe) throw new NotFoundException('Ya existe un RUPE para este beneficiario');

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
      }
    });

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
