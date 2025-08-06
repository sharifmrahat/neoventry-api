import { IsInt, IsOptional, IsString } from 'class-validator';

export class PlanCreateInput {
  @IsString()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsInt()
  price: number;

  @IsString()
  planDurationId: string;

  @IsInt()
  companyLimit: number;

  @IsInt()
  userLimit: number;

  @IsInt()
  productLimit: number;

  @IsInt()
  orderLimit: number;
}

export class PlanUpdateInput extends PlanCreateInput {
  @IsString()
  id: string;
}
