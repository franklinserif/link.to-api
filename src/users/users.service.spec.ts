import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '@users/users.service';
import { User } from '@users/entities/user.entity';
import * as encrypt from '@libs/encrypt';
import { USERS } from '@shared/constants/testVariables';
import { PassportModule } from '@nestjs/passport';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;
  const USERS_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        UsersService,
        {
          provide: USERS_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(() => USERS),
            findOneBy: jest.fn((criteria: { id: string }) =>
              USERS.find((user) => (user.id === criteria.id ? user : null)),
            ),
            findOne: jest.fn(
              (criteria: { where: { id: string } }) =>
                USERS.find((user) => user.id === criteria.where.id) || null,
            ),
            save: jest.fn(() => ({ ...USERS[0] })),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(USERS_REPOSITORY_TOKEN);

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

  it('should be called', async () => {
    await service.findAll();
    expect(usersRepository.find).toHaveBeenCalled();
  });

  it('should be called', async () => {
    await service.findAll();
    expect(usersRepository.find).toHaveReturnedWith(USERS);
  });

  it('should find a user', async () => {
    const userId = USERS[0].id;
    const user = await service.findOne(userId);
    expect(user).toEqual(USERS[0]);
    expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
  });

  it('should update a user', async () => {
    const userId = USERS[0].id;
    const updateUserDto = { ...USERS[0], firstName: 'Updated Name' };
    const updatedUser = await service.update(userId, updateUserDto);

    expect(updatedUser.firstName).toBe('Updated Name');
    expect(usersRepository.save).toHaveBeenCalledWith(
      expect.objectContaining(updateUserDto),
    );
  });
});
