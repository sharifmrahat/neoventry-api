import { PrismaClient } from '@prisma/client';
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private static instance: PrismaService;
  private connected = false;

  constructor() {
    if (PrismaService.instance) return PrismaService.instance;
    super();
    PrismaService.instance = this;
  }

  async onModuleInit() {
    if (!this.connected) {
      await this.$connect();
      this.connected = true;
      console.log('📦 Prisma client is connected!');
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    (this as any).$on('beforeExit', async () => await app.close());
  }
}
