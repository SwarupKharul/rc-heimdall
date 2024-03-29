import * as config from 'config';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as bodyParser from 'body-parser';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from 'src/interceptor/sentry.interceptor';
/**
 * Bootstrap application by attaching middleware and initializing auxillary services
 * @internal
 */
async function bootstrap() {
  /** set the logging levels */
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'verbose'],
  });

  /** configuring Sentry */
  Sentry.init({
    dsn: config.get('sentry.dsn'),
  });

  /** configuring swaggerUI */
  const options = new DocumentBuilder()
    .setTitle(config.get('api.name'))
    .setDescription(config.get('api.description'))
    .setVersion(config.get('api.version'))
    .setContact('Yash Kumar Verma', 'https://yashkumarverma.github.io/', 'yk.verma2000@gmail.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.get('api.route'), app, document);

  /** attaching middleware */
  app.enableCors();
  app.use(helmet());
  app.useGlobalInterceptors(new SentryInterceptor());
  app.use(bodyParser.json({ limit: '50mb' }));

  /**
   * windowMs : time interval
   * max: number of requests
   *
   * this will allow max number of requests every windowMs seconds
   */
  app.use(
    rateLimit({
      windowMs: 1000 * 1,
      max: 10,
    }),
  );

  /** binding port to service */
  await app.listen(config.get('server.port'));
  // server.setTimeout(10000);
}

/** launch the application */
bootstrap();
