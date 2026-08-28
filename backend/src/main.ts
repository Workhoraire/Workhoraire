import { ConfigService } from '@nestjs/config';
import type { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KeycloakService } from './auth/keycloak.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
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
