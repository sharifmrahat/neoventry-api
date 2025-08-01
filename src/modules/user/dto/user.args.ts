import { Prisma, Role } from '@prisma/client';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { BaseQueryArgs, BaseSortArgs } from 'src/common/dto/base.dto';

export class UserQueryArgs extends BaseQueryArgs {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export class UserSortArgs extends BaseSortArgs {
  @IsOptional()
  @IsEnum(Prisma.UserScalarFieldEnum)
  sortBy?: string;
}
