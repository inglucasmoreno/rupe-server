import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RupeConductorDiscapacitado } from '@prisma/client';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';


@Injectable()
export class RupeConductorDiscapacitadoService {

  constructor(
    private readonly configService: ConfigService,
    private prisma: PrismaService
  ) { }

  // RUPE por ID
  async getId(id: number): Promise<RupeConductorDiscapacitado> {

    const rupe = await this.prisma.rupeConductorDiscapacitado.findFirst({
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

    const rupe = await this.prisma.rupeConductorDiscapacitado.findFirst({
      where: { id },
      include: {
        beneficiario: true,
        vehiculo: true,
        creatorUser: true,
      }
    });

    if (!rupe) throw new NotFoundException('El RUPE no existe');

    // conductores de este rupe
    const conductores = await this.prisma.rupeConductores.findMany({
      where: {
        rupeConductorDiscapacitadoId: id,
        activo: true
      },
      include: {
        persona: true
      }
    })

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
                width: 120,
              },
              {
                stack: [
                  {
                    text: `Libre Estacionamiento
                           Transporte de Personas
                           con Discapacidad`,
                    style: 'header'
                  },
                  {
                    text: `R.U.P.E N° ${rupe.id.toString().padStart(8, '0')}`,
                    style: 'tituloRupe'
                  },
                  {
                    text: `OBLEA ÚNICA`,
                    style: 'obleaUnica'
                  },
                ]
              }
            ],
          },

          {
            image: this.configService.get('NODE_ENV') === 'production' ? `../assets/logoDiscapacidad.png` : './assets/frase.png',
            width: 530,
            style: {
              alignment: 'center',
              marginTop: 20,
            }
          },

          {
            image: this.configService.get('NODE_ENV') === 'production' ? `../assets/logoDiscapacidad.png` : './assets/logoConductorDiscapacitado.png',
            width: 270,
            style: {
              alignment: 'center',
              marginTop: 20,
            }
          },

          {

            columns: [
              {
                text: [
                  {
                    text: `BENEFICIARIO`,
                    bold: false,
                  },
                ],
                style: 'primerTituloFormulario'
              },
              {
                text: [
                  {
                    text: `DNI BENEFICIARIO`,
                    bold: false,
                    style: {
                      alignment: 'right',
                    }
                  },
                ],
                style: 'tituloDniBeneficiario'
              }
            ],

          },

          {

            columns: [
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
                text: [
                  {
                    text: `${rupe.beneficiario.dni}`,
                    bold: true,
                  },
                ],
                style: 'campoDniBeneficiario'
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
                    text: `FECHA OTORGAMIENTO`,
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
                    text: `${rupe.vehiculo.marca} ${rupe.vehiculo.modelo}`,
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
                style: 'campoFechaOtorgamiento'
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
                text: [
                  {
                    text: `FECHA VENCIMINETO`,
                    bold: false,
                    style: {
                      alignment: 'right',
                    }
                  },
                ],
                style: 'tituloFechaVencimiento'
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
                text: [
                  {
                    text: `${format(new Date(rupe.fechaVencimiento), 'dd/MM/yyyy')}`,
                    bold: true,
                  },
                ],
                style: 'campoFechaVencimiento'
              }
            ],

          },

          {

            columns: [
              {
                text: [
                  {
                    text: `CONDUCTOR 1`,
                    bold: false,
                  },
                ],
                style: 'primerTituloFormulario'
              },
              {
                text: [
                  {
                    text: `DNI CONDUCTOR 1`,
                    bold: false,
                    style: {
                      alignment: 'right',
                    }
                  },
                ],
                style: 'tituloDniConductor'
              }
            ],

          },

          {

            columns: [
              {
                text: [
                  {
                    text: `${ conductores[0] ? conductores[0].persona.apellido : ''} ${ conductores[0] ? conductores[0].persona.nombre : ''}`,
                    bold: true,
                  },
                ],
                style: 'campoFormulario'
              },
              {
                text: [
                  {
                    text: `${ conductores[0] ? conductores[0].persona.dni : ''}`,
                    bold: true,
                  },
                ],
                style: 'campoDniConductor'
              }
            ],

          },

          {

            columns: [
              {
                text: [
                  {
                    text: `CONDUCTOR 2`,
                    bold: false,
                  },
                ],
                style: 'primerTituloFormulario'
              },
              {
                text: [
                  {
                    text: `DNI CONDUCTOR 2`,
                    bold: false,
                    style: {
                      alignment: 'right',
                    }
                  },
                ],
                style: 'tituloDniConductor'
              }
            ],

          },

          {

            columns: [
              {
                text: [
                  {
                    text: `${conductores[1] ? conductores[1].persona.apellido : ''} ${conductores[1] ? conductores[1].persona.nombre : ''}`,
                    bold: true,
                  },
                ],
                style: 'campoFormulario'
              },
              {
                text: [
                  {
                    text: `${conductores[1] ? conductores[1].persona.dni : ''}`,
                    bold: true,
                  },
                ],
                style: 'campoDniConductor'
              }
            ],

          },

          {

            columns: [
              {
                text: [
                  {
                    text: `CONDUCTOR 3`,
                    bold: false,
                  },
                ],
                style: 'primerTituloFormulario'
              },
              {
                text: [
                  {
                    text: `DNI CONDUCTOR 3`,
                    bold: false,
                    style: {
                      alignment: 'right',
                    }
                  },
                ],
                style: 'tituloDniConductor'
              }
            ],

          },

          {

            columns: [
              {
                text: [
                  {
                    text: `${conductores[2] ? conductores[2].persona.apellido : ''} ${conductores[2] ? conductores[2].persona.nombre : ''}`,
                    bold: true,
                  },
                ],
                style: 'campoFormulario'
              },
              {
                text: [
                  {
                    text: `${conductores[2] ? conductores[2].persona.dni : ''}`,
                    bold: true,
                  },
                ],
                style: 'campoDniConductor'
              }
            ],

          },

          {

            columns: [
              {
                text: [],
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
            fontSize: 27,
            bold: true,
            marginLeft: 50,
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
            marginTop: 10,
          },
          campoFormulario: {
            fontSize: 13,
            bold: true,
            marginTop: 7,
          },
          campoDerechaFormulario: {
            alignment: 'right',
            fontSize: 13,
            marginTop: 10
          },
          tituloDniConductor: {
            marginTop: 10,
            marginRight: 32,
          },
          campoDniConductor: {
            alignment: 'right',
            fontSize: 13,
            marginRight: 86,
            marginTop: 10
          },
          tituloFechaVencimiento: {
            marginTop: 10,
            marginRight: 16,
          },
          campoFechaVencimiento: {
            alignment: 'right',
            fontSize: 13,
            marginRight: 78,
            marginTop: 10
          },
          campoFechaOtorgamiento: { 
            alignment: 'right',
            fontSize: 13,
            marginRight: 77,
            marginTop: 10
          },
          tituloDniBeneficiario: {
            marginTop: 10,
            marginRight: 33,
          },
          campoDniBeneficiario: {
            alignment: 'right',
            fontSize: 13,
            marginRight: 84,
            marginTop: 10
          },
          fechaVencimiento: {
            marginTop: 20,
            marginRight: 14,
          },
          firma: {
            alignment: 'right',
            marginRight: 5,
            marginTop: 27
          },
          tituloRupe: {
            alignment: 'center',
            marginTop: 2,
            fontSize: 13,
          },
          obleaUnica: {
            alignment: 'center',
            marginTop: 5,
            bold: true
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

    });

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
    const totalItems = await this.prisma.rupeConductorDiscapacitado.count({ where });

    // Listado de RUPES
    const rupes = await this.prisma.rupeConductorDiscapacitado.findMany({
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
  async insert(createData: any): Promise<RupeConductorDiscapacitado> {

    // Verificacion - Ya existe un rupe con este beneficiario
    const existeRupe = await this.prisma.rupeConductorDiscapacitado.findFirst({
      where: {
        beneficiarioId: createData.beneficiarioId
      }
    })

    if (existeRupe) throw new NotFoundException('Ya existe un RUPE para este beneficiario');

    return await this.prisma.rupeConductorDiscapacitado.create({
      data: createData,
      include: {
        vehiculo: true,
        beneficiario: true,
        creatorUser: true
      }
    });
  }

  // Actualizar RUPE
  async update(id: number, updateData: Prisma.RupeConductorDiscapacitadoUpdateInput): Promise<RupeConductorDiscapacitado> {
    return await this.prisma.rupeConductorDiscapacitado.update({
      where: { id },
      data: updateData,
      include: {
        vehiculo: true,
        beneficiario: true,
        creatorUser: true
      }
    })
  }

}
