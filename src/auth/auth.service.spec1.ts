import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@auth/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import * as encrypt from '@libs/encrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: Repository<User>;
  let jwtService: JwtService;

  const USERS_REPOSITORY_TOKEN = getRepositoryToken(User);
  const dbMockUser: User = {
    id: '1223423',
    username: 'johnDoe',
    firstName: 'john',
    lastName: 'doe',
    email: 'johndoe@gmail.com',
    password: 'hashPassword123*qdw',
    createdAt: new Date(),
    updatedAt: new Date(),
    links: null,
    checkProperties: jest.fn(),
  };

  const user = {
    username: 'johnDoe',
    firstName: 'john',
    lastName: 'doe',
    email: 'johndoe@gmail.com',
    password: '*Fr04126674413',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('fake-jwt-token'),
            verifyAsync: jest.fn().mockResolvedValue({ id: '1223423' }),
          },
        },
        {
          provide: USERS_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(() => dbMockUser),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<User>>(USERS_REPOSITORY_TOKEN);
    jwtService = module.get<JwtService>(JwtService);
    jest
      .spyOn(encrypt, 'encryptPassword')
      .mockResolvedValue('hashPassword123*qdw');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('usersRepository should be defined', () => {
    expect(usersRepository).toBeDefined();
  });

  it('should create new user with encoded password', async () => {
    const password = '*Fr04126674413';
    await service.signUp(user);

    expect(encrypt.encryptPassword).toHaveBeenCalledWith(password);
  });

  it('shoul call userRepository.create with correct params', async () => {
    await service.signUp(user);

    expect(usersRepository.create).toHaveBeenCalledWith({
      ...user,
      password: 'hashPassword123*qdw',
    });

    expect(usersRepository.create).toHaveReturnedWith(dbMockUser);
  });

  it('should return tokens', async () => {
    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(dbMockUser);

    const tokens = await service.refreshToken('refresh-token');

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('refresh-token');
    expect(tokens).toBeDefined();
  });
});
