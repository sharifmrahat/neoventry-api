import { Module } from '@nestjs/common';
import { PlanFeatureService } from './plan-feature.service';
import { PlanFeatureController } from './plan-feature.controller';

@Module({
  providers: [PlanFeatureService],
  exports: [PlanFeatureService],
  controllers: [PlanFeatureController],
})
export class PlanFeatureModule {}
