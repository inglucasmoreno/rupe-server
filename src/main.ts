import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import morgan from 'morgan';
import { CORS } from './constants';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // Seteo de prefijo
  app.setGlobalPrefix('api');

  // MORGAN - DEV
  app.use(morgan('dev'));

  // Accedemos a las variables de entorno
  const configService = app.get(ConfigService);

  // CORS
  app.enableCors(CORS);

  // Validaciones
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    // forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))

  // app.setGlobalPrefix('api') // Para agregar un prefijo (Suele usarse para especificar versiones)

  // Inicio del servidor
  await app.listen(configService.get('PORT') || 3000);
  console.log(`Aplicacion corriendo en: ${await app.getUrl()}`);

}
bootstrap();
