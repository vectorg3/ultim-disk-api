import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
      const app = await NestFactory.create(AppModule, {
            cors: {
                  origin: '*',
                  methods: ['GET', 'POST', 'PUT', 'DELETE'],
                  credentials: true,
                  exposedHeaders: ['Content-Disposition']
            }
      });
      app.setGlobalPrefix('api');
      app.useGlobalPipes(new ValidationPipe());

      const config = new DocumentBuilder()
            .setTitle('UltimDiskApi')
            .setDescription('The UltimDiskApi API description')
            .setVersion('1.0')
            .build();
      const documentFactory = () => SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, documentFactory);
      await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
