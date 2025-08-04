import { CompanyApplicationStatus } from '@prisma/client';
import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class CompanyCreateInput {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;
}

export class CompanyUpdateInput extends CompanyCreateInput {
  @IsString()
  id: string;
}

export class CompanyUpdateStatusInput {
  @IsString()
  id: string;

  @IsIn([CompanyApplicationStatus])
  status: CompanyApplicationStatus;
}
