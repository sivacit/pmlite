import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entity/auth.entity';



describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(), // Mock login function
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call AuthService.login with the correct parameters', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockAuthEntity: AuthEntity = {
        accessToken: 'some-jwt-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      // Mock the login method of AuthService to return a token
      jest.spyOn(authService, 'login').mockResolvedValue(mockAuthEntity);

      const result = await controller.login(loginDto);

      // Check if AuthService.login was called with the correct parameters
      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(result).toEqual(mockAuthEntity); // Ensure the result is the expected mock value
    });
  });
});
