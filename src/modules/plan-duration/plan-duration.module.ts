import { Module } from '@nestjs/common';
import { PlanDurationService } from './plan-duration.service';
import { PlanDurationController } from './plan-duration.controller';

@Module({
  providers: [PlanDurationService],
  exports: [PlanDurationService],
  controllers: [PlanDurationController],
})
export class PlanDurationModule {}
