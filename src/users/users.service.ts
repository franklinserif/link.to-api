import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from '@users/dto';
import { User } from '@users/entities/user.entity';
import { encryptPassword } from '@libs/encrypt';
import { ErrorManager } from '@shared/exceptions/ExceptionManager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userRepository.find();

      return users;
    } catch (error) {
      throw new ErrorManager(error, 'cannot find users');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(`User with id ${id} doesn't exist`);
      }

      return user;
    } catch (error) {
      throw new ErrorManager(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!Boolean(user)) {
        throw new NotFoundException(`User with id ${id} doesn't exist`);
      }

      if (updateUserDto?.password) {
        updateUserDto.password = await encryptPassword(updateUserDto.password);
      }

      Object.assign(user, updateUserDto);

      return await this.userRepository.save(user);
    } catch (error) {
      throw new ErrorManager(error);
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      return await this.userRepository.delete(id);
    } catch (error) {
      throw new ErrorManager(error, `can't delete user with ${id}`);
    }
  }
}
