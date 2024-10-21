import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generatePassword } from '../utils/id-generator';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        PrismaService,
        UsersService,        
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const pass = await generatePassword('password');
    const createUserDto: CreateUserDto = { 
      name: 'John Doe', 
      email: 'john@example.com', 
      password: pass.password, 
      salt: pass.salt 
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


    jest.spyOn(service, 'create').mockResolvedValue(mockUser);

    expect(await controller.create(createUserDto)).toBe(mockUser);
    expect(service.create).toHaveBeenCalledWith(createUserDto);
  });

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

    jest.spyOn(service, 'findAll').mockResolvedValue(mockUsers);

    expect(await controller.findAll()).toBe(mockUsers);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single user', async () => {
    const mockUser = {
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
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

    const result = await controller.findOne('1');
    expect(result).toBe(mockUser);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = { name: 'John Doe Updated' };

    const mockUpdatedUser = {
      id: '1',
      name: 'John Doe Updated',
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
    };

    jest.spyOn(service, 'update').mockResolvedValue(mockUpdatedUser);

    expect(await controller.update('1', updateUserDto)).toBe(mockUpdatedUser);
    expect(service.update).toHaveBeenCalledWith('1', updateUserDto);
  });

  // it('should remove a user', async () => {
  //   // jest.spyOn(service, 'remove').mockResolvedValue('deletedUser');

  //   expect(await controller.remove('1')).toBe('deletedUser');
  //   expect(service.remove).toHaveBeenCalledWith('1');
  // });
});
