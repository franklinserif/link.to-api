import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      signIn: jest.fn().mockResolvedValue({
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('development'),
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

  it('should call signIn and return accessToken', async () => {
    const signInDto: SignInDto = { username: 'testuser', password: 'password' };
    const mockResponse = {
      cookie: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;

    await controller.signIn(signInDto, mockResponse);

    expect(authService.signIn).toHaveBeenCalledWith(signInDto);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'refreshToken',
      'test-refresh-token',
      {
        httpOnly: true,
        secure: false, // based on mock ConfigService returning 'development'
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );
    expect(mockResponse.send).toHaveBeenCalledWith({
      accessToken: 'test-access-token',
    });
  });

  it('should call signUp and return accessToken and user', async () => {
    const createUserDto = {
      username: 'johnDoe',
      password: '*Jd12345678',
      email: 'johnDoe',
      firstName: 'John',
      lastName: 'Doe',
    };
    const mockResponse = {
      cookie: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;

    const mockUser = { id: 1, username: 'newuser' };

    authService.signUp = jest.fn().mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      user: mockUser,
    });

    await controller.signUp(createUserDto, mockResponse);

    expect(authService.signUp).toHaveBeenCalledWith(createUserDto);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'refreshToken',
      'new-refresh-token',
      {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );
    expect(mockResponse.send).toHaveBeenCalledWith({
      accessToken: 'new-access-token',
      user: mockUser,
    });
  });
});
