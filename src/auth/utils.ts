import type { Prisma } from '@prisma/client';

export class IUserMeVo {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  isAdmin: boolean;
  notifyMeta: object | null;
  avatar: string | null;
  hasPassword: boolean;

  constructor(
    id: string,
    name: string,
    phone: string | null,
    email: string,
    isAdmin: boolean,
    notifyMeta: object | null,
    avatar: string | null,
    hasPassword: boolean
  ) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.isAdmin = isAdmin;
    this.notifyMeta = notifyMeta;
    this.avatar = avatar;
    this.hasPassword = hasPassword;
  }
}


export const pickUserMe = (
  user: Pick<
    Prisma.UserGetPayload<null>,
    'id' | 'name' | 'avatar' | 'phone' | 'email' | 'password' | 'notifyMeta' | 'isAdmin'
  >
): IUserMeVo => {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    isAdmin: user.isAdmin,
    notifyMeta: typeof user.notifyMeta === 'object' ? user.notifyMeta : JSON.parse(user.notifyMeta),    
    hasPassword: user.password !== null,
    avatar: user.avatar,
  };
};
