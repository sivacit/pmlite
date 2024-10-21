import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { generatePassword } from '../utils/id-generator';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  const email = 'test@example.com';
  const password = 'password';

  const mockUser = {
    id: '1',
    name: 'John Doe',
    password: password, // Mocked hashed password
    salt: 'salt',
    phone: '1234567890',
    email: email,
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const email = 'test@example.com';
    const password = 'password';    

    it('should throw NotFoundException if no user is found', async () => {
      // Mock PrismaService to return null, simulating user not found
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.login(email, password)).rejects.toThrow(NotFoundException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email } });
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      // Mock user returned from Prisma
      
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      // Mock bcrypt to return false, simulating incorrect password
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(email, password)).rejects.toThrow(UnauthorizedException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });

    it('should return an AuthEntity if login is successful', async () => {
      // Mock user returned from Prisma
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      // Mock bcrypt to return true, simulating correct password
      const mockUserUpdated = {
        ...mockUser,
        email: email,
        password: password,
        
      }
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      // Mock JWT signing
      const mockToken = 'mockJwtToken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await service.login(email, password);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ userId: mockUser.id, email: mockUser.email });

      // Verify that the correct AuthEntity is returned
      expect(result).toEqual({
        accessToken: mockToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
      });
    });
  });
});
