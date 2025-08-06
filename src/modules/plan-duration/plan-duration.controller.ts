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
import { PlanDurationService } from './plan-duration.service';
import {
  GetPlanDurationArgs,
  GetPlanDurationSortArgs,
} from './dto/plan-duration.args';
import {
  PlanDurationCreateInput,
  PlanDurationUpdateInput,
} from './dto/plan-duration.input';
import { AdminOrSuperAdmin } from 'src/common/decorators/role.decorator';

@Controller('planDuration')
export class PlanDurationController {
  constructor(private readonly planDurationService: PlanDurationService) {}

  @AdminOrSuperAdmin()
  @Post('/')
  createPlanDuration(@Body() input: PlanDurationCreateInput) {
    return this.planDurationService.create(input);
  }

  @AdminOrSuperAdmin()
  @Get('/')
  getAllPlanDuration(
    @Query() query: GetPlanDurationArgs,
    @Query() sort: GetPlanDurationSortArgs,
  ) {
    return this.planDurationService.findAll(query, sort);
  }

  @AdminOrSuperAdmin()
  @Get('/')
  getPlanDurationById(@Param('id') planDurationId: string) {
    return this.planDurationService.findOneById(planDurationId);
  }

  @AdminOrSuperAdmin()
  @Patch('/')
  updatePlanDurationById(@Body() input: PlanDurationUpdateInput) {
    return this.planDurationService.updateOneById(input);
  }

  @AdminOrSuperAdmin()
  @Delete('/')
  deletePlanDurationById(@Param('id') planDurationId: string) {
    return this.planDurationService.deleteOneById(planDurationId);
  }
}
