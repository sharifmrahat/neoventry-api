import { IsOptional, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

export class UserUpdateInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsPhoneNumber('BD')
  phone?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  currentPassword?: string;

  @IsOptional()
  @IsString()
  newPassword?: string;
}
