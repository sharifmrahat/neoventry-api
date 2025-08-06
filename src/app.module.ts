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
import { JwtStrategy } from './common/jwt.strategy';
import { CompanyModule } from './modules/company/company.module';
import { PlanService } from './modules/plan/plan.service';
import { PlanModule } from './modules/plan/plan.module';
import { PlanDurationModule } from './modules/plan-duration/plan-duration.module';
import { PlanFeatureModule } from './modules/plan-feature/plan-feature.module';

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
    CompanyModule,
    PlanModule,
    PlanDurationModule,
    PlanFeatureModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard, JwtStrategy, PlanService],
  exports: [JwtAuthGuard],
})
export class AppModule {}
