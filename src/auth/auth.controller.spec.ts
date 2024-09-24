import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '@users/dto';
import { PassportModule } from '@nestjs/passport';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      signIn: jest.fn().mockResolvedValue({
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      }),
      signUp: jest.fn().mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: { id: 1, username: 'newuser' },
      }),
      refreshToken: jest.fn().mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
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
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );
    expect(mockResponse.send).toHaveBeenCalledWith({
      accessToken: 'test-access-token',
    });
  });

  it('should call signUp and return accessToken and user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'johnDoe',
      password: '*Jd12345678',
      email: 'johnDoe@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };
    const mockResponse = {
      cookie: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;

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
      user: { id: 1, username: 'newuser' },
    });
  });

  it('should call refreshToken and return new accessToken', async () => {
    const mockResponse = {
      cookie: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;

    await controller.refreshToken('test-refresh-token', mockResponse);

    expect(authService.refreshToken).toHaveBeenCalledWith('test-refresh-token');
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
    });
  });

  it('should throw UnauthorizedException on refreshToken failure', async () => {
    const mockResponse = {
      cookie: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;

    jest
      .spyOn(authService, 'refreshToken')
      .mockRejectedValue(new UnauthorizedException());

    await expect(
      controller.refreshToken('invalid-refresh-token', mockResponse),
    ).rejects.toThrow(UnauthorizedException);
  });
});
