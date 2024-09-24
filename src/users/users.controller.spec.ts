import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from '@users/dto';
import { PassportModule } from '@nestjs/passport';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserService = {
    findAll: jest.fn(() => ['user1', 'user2']),
    findOne: jest.fn((id: string) => ({ id, name: 'user' })),
    update: jest.fn((id: string, updateUserDto: UpdateUserDto) => ({
      id,
      ...updateUserDto,
    })),
    remove: jest.fn((id: string) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(['user1', 'user2']);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const id = '1';
      const result = await controller.findOne(id);
      expect(result).toEqual({ id, name: 'user' });
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = { firstName: 'updatedUser' };
      const result = await controller.update(id, updateUserDto);
      expect(result).toEqual({ id, ...updateUserDto });
      expect(service.update).toHaveBeenCalledWith(id, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user by id', async () => {
      const id = '1';
      const result = await controller.remove(id);
      expect(result).toEqual({ id });
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
