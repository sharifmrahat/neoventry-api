import { IsString } from 'class-validator';

export class PlanFeatureCreateInput {
  @IsString()
  title: string;

  @IsString()
  conditions: string[];
}

export class PlanFeatureUpdateInput extends PlanFeatureCreateInput {
  @IsString()
  id: string;
}
