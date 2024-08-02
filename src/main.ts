import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { urlencoded, json } from 'express';
import { Logger } from 'nestjs-pino';
import { mongoose } from '@typegoose/typegoose';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/filters/allException.filter';
import { TimestampInterceptor } from './utils/interceptors/timestamp.interceptor';
import { ResponseWrapperInterceptor } from './utils/interceptors/responseWrapper.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: true,
  });

  const logger = app.get<Logger>(Logger);
  const config = app.get<ConfigService>(ConfigService);
  app.setGlobalPrefix(config.get('APP_PREFIX'));
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter(logger, config));
  app.useGlobalInterceptors(
    new TimestampInterceptor(),
    new ResponseWrapperInterceptor(),
  );

  const options = new DocumentBuilder()
    .setTitle(config.get('npm_package_name'))
    .addTag('Health', 'Help endpoints')
    .setVersion(config.get('npm_package_version'))
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);

  app.enableShutdownHooks();

  await app.listen(config.get('PORT'), '0.0.0.0', () =>
    logger.log(
      `service ${config.get(
        'npm_package_name',
      )} is listening on port ${config.get(
        'PORT',
      )} with prefix path '/${config.get(
        'APP_PREFIX',
      )} in the environment ${config.get('NODE_ENV')} 🚀 | MongoDB: ${config.get(
        'MONGO_URL',
      )} `,
      'AppStart',
    ),
  );

  process.on('SIGTERM', async () => {
    logger.debug('SIGTERM signal received.');
    logger.log('Closing http server.');
    await app.close();
    logger.log('Http server closed.');
    mongoose.connection
      .close(false)
      .then(() => {
        logger.log('MongoDb connection closed.');
      })
      .catch((e) => {
        logger.error(e);
      })
      .finally(() => {
        logger.log('Process exit');
        process.exit(0);
      });
  });
}
bootstrap();
