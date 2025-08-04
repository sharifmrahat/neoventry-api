import { Prisma } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GetBaseDto, GetBaseSortDto } from 'src/common/dto/base.dto';

export class GetCompanyArgs extends GetBaseDto {
  @IsOptional()
  @IsString()
  ownerId?: string;
}

export class GetCompanySortArgs extends GetBaseSortDto {
  @IsOptional()
  @IsEnum(Prisma.CompanyScalarFieldEnum)
  sortBy?: string;
}
