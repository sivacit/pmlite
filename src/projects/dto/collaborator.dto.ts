import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum Role {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export class CreateCollaboratorDto {
  
  @IsEnum(Role)  // Ensure valid role
  @IsOptional()  // Optional, will default to EDITOR if not provided
  roleName?: Role;

  @IsString()
  resourceType: string;  // Resource type (e.g., project, task)

  @IsString()
  resourceId: string;  // Resource ID (unique)

  @IsString()
  userId: string;  // User ID (foreign key)

  @IsString()
  createdBy: string;  // Creator's ID
}
