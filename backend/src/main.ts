import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { KeycloakService } from './auth/keycloak.service';

async function bootstrap(): Promise<void> {
  // The raw body is kept for the signature of Stripe webhooks.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  // Behind the HTTPS proxy: the client IP (rate limiting) comes from X-Forwarded-For.
  const trustProxy = process.env.TRUST_PROXY;
  if (trustProxy) {
    app.set('trust proxy', Number.isNaN(Number(trustProxy)) ? trustProxy : Number(trustProxy));
  }
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );
  const configService = app.get(ConfigService);
  const keycloakService = app.get(KeycloakService);
  const frontendUrl = configService.get<string>(
    'FRONTEND_URL',
    'http://localhost:4200',
  );
  const corsOrigin: CustomOrigin = (requestOrigin, callback) => {
    if (!requestOrigin || requestOrigin === frontendUrl) {
      callback(null, true);
      return;
    }

    callback(null, false);
  };

  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Accept', 'Authorization', 'Content-Type'],
  });

  app.use(...keycloakService.getMiddleware());

  const port = process.env.PORT ?? 3000;

  await app.listen(port);
}

void bootstrap();
