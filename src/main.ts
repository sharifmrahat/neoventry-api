import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const environment = configService.get<string>('environment');
  const hostUrl = configService.get<string>('hostUrl');
  const port = configService.get<number>('port');
  const appName = configService.get<string>('appName');
  const apiPrefix = configService.get<string>('apiPrefix');

  app.enableCors();
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown properties
      forbidNonWhitelisted: true, // throw error if unknown props
      transform: true, // automatically transform payloads to DTO classes
    }),
  );
  await app.listen(port);

  console.log(
    `🚀 ${appName} is running in ${environment} environment on ${hostUrl}:${port}${apiPrefix}`,
  );
}

bootstrap();
