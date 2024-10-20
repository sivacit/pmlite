import { IsString, IsOptional, IsDateString, IsNumber, IsEnum } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;  // New field for project deadline

  @IsOptional()
  @IsNumber()
  budget?: number;  // New field for project budget

  @IsEnum(['OPEN', 'CLOSED'])  // New field for project status
  status: string;
}
