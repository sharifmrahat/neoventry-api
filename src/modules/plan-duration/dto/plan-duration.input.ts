import { IsOptional, IsString } from 'class-validator';

export class PlanDurationCreateInput {
  @IsString()
  name: string;

  @IsString()
  range: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  planId?: string;
}

export class PlanDurationUpdateInput extends PlanDurationCreateInput {
  @IsString()
  id: string;
}
