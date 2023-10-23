import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { jwtConstants } from './modules/auth/constants';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { InicializacionModule } from './modules/inicializacion/inicializacion.module';
import { PersonasModule } from './modules/personas/personas.module';
import { VehiculosModule } from './modules/vehiculos/vehiculos.module';
import { RupeDiscapacidadModule } from './modules/rupe-discapacidad/rupe-discapacidad.module';
import { RupeConductorDiscapacitadoModule } from './modules/rupe-conductor-discapacitado/rupe-conductor-discapacitado.module';
import { RupeConductoresModule } from './modules/rupe-conductores/rupe-conductores.module';

@Module({
  imports: [

    // Directorio publico
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),

    // Variables de entorno
    ConfigModule.forRoot({ 
      // envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true 
    }),

    // Autenticacion -> JsonWebToken
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12h' }
    }),
    
    // Custom modules
    AuthModule,
    UsuariosModule,
    InicializacionModule,
    PersonasModule,
    VehiculosModule,
    RupeDiscapacidadModule,
    RupeConductorDiscapacitadoModule,
    RupeConductoresModule,

  ],
  controllers: [AppController],
  providers: [AppService ],
})
export class AppModule {
  static port: number;
  constructor(private readonly configService: ConfigService){
    AppModule.port = +this.configService.get('PORT');
  }
}
