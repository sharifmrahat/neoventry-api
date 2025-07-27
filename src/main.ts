import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { PrismaClient } from '@prisma/client';
// import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // PostgreSQL via Prisma
  // const prisma = new PrismaClient();

  // try {
  //   await prisma.$connect();
  //   console.log('✅ PostgreSQL (Prisma) connected');
  // } catch (err) {
  //   console.error('❌ PostgreSQL connection failed:', err);
  // }

  // // MongoDB connection status (optional check)
  // mongoose.connection.on('connected', () => {
  //   console.log('✅ MongoDB connected');
  // });

  // mongoose.connection.on('error', (err) => {
  //   console.error('❌ MongoDB connection error:', err);
  // });

  const port = process.env.PORT || 5000;

  await app.listen(port);
  console.log(`🚀 Neoventry API is running on http://localhost:${port}`);
}
bootstrap();
