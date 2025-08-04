import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SortOrder } from 'src/interfaces/enums/sort-order';

export class GetBaseDto {
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

export class GetBaseSortDto {
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
