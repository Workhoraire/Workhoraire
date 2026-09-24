import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UnknownErrorFilter } from './common/filters/unknown-error.filter';

/**
 * Application-wide HTTP setup, shared by main.ts and the e2e tests so that
 * the tests run the real configuration. Authentication is done by the guards.
 */
export function configureApp(app: NestExpressApplication): void {
  const config = app.get(ConfigService);

  // Behind the HTTPS proxy: the client IP (rate limiting) comes from X-Forwarded-For.
  const trustProxy = config.get<string>('TRUST_PROXY');
  if (trustProxy) {
    app.set('trust proxy', Number.isNaN(Number(trustProxy)) ? trustProxy : Number(trustProxy));
  }

  // Library errors (Stripe, Prisma…) never reach the client as they are.
  app.useGlobalFilters(new UnknownErrorFilter(app.getHttpAdapter()));

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  const frontendUrl = config.get<string>('FRONTEND_URL', 'http://localhost:4200');
  app.enableCors({
    origin: (requestOrigin, callback) => callback(null, !requestOrigin || requestOrigin === frontendUrl),
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Accept', 'Authorization', 'Content-Type'],
  });

  // Lets the database connection and scheduled jobs close on SIGTERM.
  app.enableShutdownHooks();
}
