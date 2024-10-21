import { IsEmail, IsOptional, IsString, IsBoolean, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @IsString()
  type: string;

  @IsString()
  provider: string;

  @IsString()
  providerId: string;
}

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @MinLength(6)  // Enforce a minimum password length
  @ApiProperty()
  password: string;

  salt: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  phone?: string;

  @IsEmail()  // Ensure the email is valid
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsOptional()
  @IsString()
  notifyMeta?: string;

  // @ValidateNested({ each: true }) // Ensure the account is valid
  // @Type(() => CreateAccountDto)  // Required for class-transformer to work
  // accounts: CreateAccountDto[];  // You can allow multiple accounts
}
