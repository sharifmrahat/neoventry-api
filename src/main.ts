import { GlobalExceptionFilter } from './common/global-exceptions';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './common/guards/role.guard';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const environment = configService.get<string>('environment');
    const hostUrl = configService.get<string>('hostUrl');
    const port = configService.get<number>('port');
    const appName = configService.get<string>('appName');
    const apiPrefix = configService.get<string>('apiPrefix');

    app.enableCors();
    app.setGlobalPrefix(apiPrefix);
    app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // strips unknown properties
        forbidNonWhitelisted: true, // throw error if unknown props
        transform: true, // automatically transform payloads to DTO classes
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.listen(port);

    console.log(
      `🚀 ${appName} is running in ${environment} environment on ${hostUrl}:${port}${apiPrefix}`,
    );
  } catch (error) {
    console.log('Failed to run app');
  }
}

bootstrap();
