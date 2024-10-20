// src/users/dto/create-user.dto.ts
export class CreateUserDto {
    name: string;
    password?: string;
    salt?: string;
    phone?: string;
    email: string;
    avatar?: string;
    isSystem?: boolean;
    isAdmin?: boolean;
    notifyMeta?: string;
    lastSignTime?: Date;
    deactivatedTime?: Date;
  }
  