import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppConfig, SwaggerConfig } from './app.types';
import { FastifyAdapter,
         NestFastifyApplication, } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Config from 'config';
import { MusicModule } from './music/musics.module';


async function bootstrap(config: AppConfig, swaggerConfig: SwaggerConfig) {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true}));

    await app.enableCors({ origin: config.cors });

    await app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    const options = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addTag(swaggerConfig.tag)
    .build();

    const document = SwaggerModule.createDocument(app, options, {
      include: [MusicModule],
    });

    SwaggerModule.setup(swaggerConfig.path, app, document);

    // launch server
    await app.listen(config.port, config.host);
    Logger.log(
      `Application served at http://${config.host}:${config.port}`,
      'bootstrap',
      `mongodb.uri : ${Config.mongodb.uri}`,
    );
}
bootstrap(
  Config.get<AppConfig>('server'),
  Config.get<SwaggerConfig>('swagger'),
);
