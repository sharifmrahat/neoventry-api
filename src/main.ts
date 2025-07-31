import { GlobalExceptionFilter } from './common/global-exceptions';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './common/guards/role.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

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

  const reflector = app.get(Reflector);
  app.useGlobalGuards(app.get(JwtAuthGuard), new RolesGuard(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(port);
  console.log(
    `🚀 ${appName} is running in ${environment} environment on ${hostUrl}:${port}${apiPrefix}`,
  );
}

bootstrap();
