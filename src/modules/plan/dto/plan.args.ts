import { Prisma } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GetBaseDto, GetBaseSortDto } from 'src/common/dto/base.dto';

export class GetPlanArgs extends GetBaseDto {
  @IsOptional()
  @IsString()
  planDurationId?: string;

  @IsOptional()
  @IsString()
  price?: number;
}

export class GetPlanSortArgs extends GetBaseSortDto {
  @IsOptional()
  @IsEnum(Prisma.PlanScalarFieldEnum)
  sortBy?: string;
}
