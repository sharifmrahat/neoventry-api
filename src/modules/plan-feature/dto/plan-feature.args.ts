import { Prisma } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GetBaseDto, GetBaseSortDto } from 'src/common/dto/base.dto';

export class GetPlanFeatureArgs extends GetBaseDto {
  @IsOptional()
  @IsString()
  planId?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  range?: string;
}

export class GetPlanFeatureSortArgs extends GetBaseSortDto {
  @IsOptional()
  @IsEnum(Prisma.PlanFeatureScalarFieldEnum)
  sortBy?: string;
}
