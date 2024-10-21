import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generatePassword } from '../utils/id-generator';
import { mock } from 'node:test';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  
  const createUserDto: CreateUserDto = { 
    name: 'John Doe', 
    email: 'john@example.com',   
    password: 'password',
    salt: 'salt',
  };

  const mockUser = {
    id: '1',
    name: 'John Doe',   
    phone: '1234567890',
    email: 'john@example.com',
    avatar: 'avatar.png',
    isSystem: false,
    isAdmin: false,
    notifyMeta: 'meta',
    lastSignTime: new Date(),
    deactivatedTime: new Date(),
    createdTime: new Date(),
    deletedTime: new Date(),
    lastModifiedTime: new Date(),
    password: 'password',
    salt: 'salt',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const pass = await generatePassword('password');      
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
      const createDto = {
        ...createUserDto,
        password: pass.password,
        salt: pass.salt
      }
      const result = await service.create(createDto);
      expect(result).toBe(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          password: expect.any(String), // Password will be hashed
          salt: expect.any(String), // Salt will be generated
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'John Doe',
          password: 'hashedPassword',
          salt: 'salt',
          phone: '1234567890',
          email: 'john@example.com',
          avatar: 'avatar.png',
          isSystem: false,
          isAdmin: false,
          notifyMeta: 'meta',
          lastSignTime: new Date(),
          deactivatedTime: new Date(),
          createdTime: new Date(),
          deletedTime: new Date(),
          lastModifiedTime: new Date(),
        },
        {
          id: '2',
          name: 'Jane Doe',
          password: 'hashedPassword',
          salt: 'salt',
          phone: '0987654321',
          email: 'jane@example.com',
          avatar: 'avatar.png',
          isSystem: false,
          isAdmin: false,
          notifyMeta: 'meta',
          lastSignTime: new Date(),
          deactivatedTime: new Date(),
          createdTime: new Date(),
          deletedTime: new Date(),
          lastModifiedTime: new Date(),
        },
      ];

      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(mockUsers);

      const result = await service.findAll();
      expect(result).toBe(mockUsers);
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      const pass = await generatePassword('password');
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await service.findOne('1');
      expect(result).toBe(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated user', async () => {
      // UpdateUserDto is used here for updating the user
      const updateUserDto: UpdateUserDto = { name: 'Updated John Doe' };
      const pass = await generatePassword('password');
      const mockExistingUser = {
        ...mockUser,
        password: pass.password,
        salt: pass.salt
      };

      const mockUpdatedUser = {
        ...mockUser,
        name: 'Updated John Doe',
        password: pass.password,
        salt: pass.salt
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockExistingUser);
      jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue(mockUpdatedUser);

      const result = await service.update('1', updateUserDto);
      expect(result).toBe(mockUpdatedUser);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateUserDto,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.update('1', { name: 'Updated Name' }),
      ).rejects.toThrow(NotFoundException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('remove', () => {
    it('should remove and return the deleted user', async () => {
      const mockExistingUser = mockUser;

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockExistingUser);
      jest
        .spyOn(prismaService.user, 'delete')
        .mockResolvedValue(mockExistingUser);

      const result = await service.remove('1');
      expect(result).toBe(mockExistingUser);
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
async function newFunction() {
  const pass = await generatePassword('password');
  const createUserDto: CreateUserDto = {
    name: 'John Doe',
    email: 'john@example.com',
    password: pass.password,
    salt: pass.salt,
  };

  const mockUser = {
    id: '1',
    name: 'John Doe',
    password: pass.password,
    salt: pass.salt,
    phone: '1234567890',
    email: 'john@example.com',
    avatar: 'avatar.png',
    isSystem: false,
    isAdmin: false,
    notifyMeta: 'meta',
    lastSignTime: new Date(),
    deactivatedTime: new Date(),
    createdTime: new Date(),
    deletedTime: new Date(),
    lastModifiedTime: new Date(),
  };
  return { mockUser, createUserDto };
}
