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
import { PlanService } from './plan.service';
import { GetPlanArgs, GetPlanSortArgs } from './dto/plan.args';
import { PlanCreateInput, PlanUpdateInput } from './dto/plan.input';
import {
  PublicAccess,
  SuperAdminOnly,
} from 'src/common/decorators/role.decorator';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @SuperAdminOnly()
  @Post('/')
  createPlan(@Body() input: PlanCreateInput) {
    return this.planService.create(input);
  }

  @PublicAccess()
  @Get('/')
  getAllPlan(@Query() query: GetPlanArgs, @Query() sort: GetPlanSortArgs) {
    return this.planService.findAll(query, sort);
  }

  @PublicAccess()
  @Get('/')
  getPlanById(@Param('id') planId: string) {
    return this.planService.findOneById(planId);
  }

  @SuperAdminOnly()
  @Patch('/')
  updatePlanById(@Body() input: PlanUpdateInput) {
    return this.planService.updateOneById(input);
  }

  @SuperAdminOnly()
  @Delete('/')
  deletePlanById(@Param('id') planId: string) {
    return this.planService.deleteOneById(planId);
  }
}
