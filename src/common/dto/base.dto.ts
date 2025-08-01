import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SortOrder } from 'src/interfaces/enums/sort-order';

export class BaseQueryArgs {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class BaseSortArgs {
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
