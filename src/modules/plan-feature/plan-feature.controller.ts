import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PlanFeatureService } from './plan-feature.service';
import {
  GetPlanFeatureArgs,
  GetPlanFeatureSortArgs,
} from './dto/plan-feature.args';
import {
  PlanFeatureCreateInput,
  PlanFeatureUpdateInput,
} from './dto/plan-feature.input';
import { AdminOrSuperAdmin } from 'src/common/decorators/role.decorator';

@Controller('planFeature')
export class PlanFeatureController {
  constructor(private readonly planFeatureService: PlanFeatureService) {}

  @AdminOrSuperAdmin()
  @Post('/')
  createPlanFeature(@Body() input: PlanFeatureCreateInput) {
    return this.planFeatureService.create(input);
  }

  @AdminOrSuperAdmin()
  @Get('/')
  getAllPlanFeature(
    @Query() query: GetPlanFeatureArgs,
    @Query() sort: GetPlanFeatureSortArgs,
  ) {
    return this.planFeatureService.findAll(query, sort);
  }

  @AdminOrSuperAdmin()
  @Get('/')
  getPlanFeatureById(@Param('id') planFeatureId: string) {
    return this.planFeatureService.findOneById(planFeatureId);
  }

  @AdminOrSuperAdmin()
  @Patch('/')
  updatePlanFeatureById(@Body() input: PlanFeatureUpdateInput) {
    return this.planFeatureService.updateOneById(input);
  }

  @AdminOrSuperAdmin()
  @Delete('/')
  deletePlanFeatureById(@Param('id') planFeatureId: string) {
    return this.planFeatureService.deleteOneById(planFeatureId);
  }
}
