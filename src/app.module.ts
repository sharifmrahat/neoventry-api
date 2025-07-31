import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { appConfig, authConfig, databaseConfig, redisConfig } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { JwtStrategy } from './modules/auth/module/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, authConfig],
    }),
    // MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    PrismaModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard, JwtStrategy],
  exports: [JwtAuthGuard],
})
export class AppModule {}
