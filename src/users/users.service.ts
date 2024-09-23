import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from '@users/dto';
import { User } from '@users/entities/user.entity';
import { encryptPassword } from '@libs/encrypt';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userRepository.find();

      return users;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('cannot find users', error);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user)
        throw new NotFoundException(`User with id ${id} doesn't exist`);

      return user;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `can't find user with id ${id}`,
        error,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user?.id) {
        throw new NotFoundException(`User with id ${id} doesn't exist`);
      }

      if (updateUserDto?.password) {
        updateUserDto.password = await encryptPassword(updateUserDto.password);
      }

      Object.assign(user, updateUserDto);

      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(`Failed to update user with id ${id}`, error);
      throw new InternalServerErrorException(
        `Failed to update user with id ${id}`,
        error,
      );
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      return await this.userRepository.delete(id);
    } catch (error) {
      this.logger.error(`Failed to delete user with id ${id} `, error);
      throw new InternalServerErrorException(
        `Failed to delete user with id ${id} `,
        error,
      );
    }
  }
}
