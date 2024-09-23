import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '@users/users.service';
import { User } from '@users/entities/user.entity';
import * as encrypt from '@libs/encrypt';
import { USERS } from '@shared/constants/testVariables';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;
  const USERS_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

  it('should throw NotFoundException when the id is not a valid UUID', async () => {
    await expect(service.findOne('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
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

  it('should throw NotFoundException when updating a non-existing user', async () => {
    await expect(
      service.update('3797caa3-faba-45b3-a377-abb1f1d48981', {
        firstName: 'New Name',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a user', async () => {
    const userId = USERS[0].id;
    await service.remove(userId);
    expect(usersRepository.delete).toHaveBeenCalledWith(userId);
  });

  it('should handle errors when deleting a user', async () => {
    (usersRepository.delete as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Delete failed');
    });

    await expect(service.remove(USERS[0].id)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
