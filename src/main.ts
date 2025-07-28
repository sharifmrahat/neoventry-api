import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/api/v1');
  const port = process.env.PORT || 5000;

  await app.listen(port);

  console.log(`🚀 Neoventry API is running on http://localhost:${port}`);
}
bootstrap();
