import { Prisma, Role } from '@prisma/client';
import { IsOptional, IsEnum } from 'class-validator';
import { GetBaseDto, GetBaseSortDto } from 'src/common/dto/base.dto';

export class UserQueryArgs extends GetBaseDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export class UserSortArgs extends GetBaseSortDto {
  @IsOptional()
  @IsEnum(Prisma.UserScalarFieldEnum)
  sortBy?: string;
}
