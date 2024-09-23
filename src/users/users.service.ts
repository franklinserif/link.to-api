import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, QueryFailedError, Repository } from 'typeorm';
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
      throw new InternalServerErrorException('cannot find users');
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
      this.handleErrors(error, id);
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
      this.handleErrors(error, id);
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      return await this.userRepository.delete(id);
    } catch (error) {
      this.handleErrors(error, id);
    }
  }

  private handleErrors(error: any, id: string) {
    this.logger.error(error);

    if (error instanceof NotFoundException) {
      throw new NotFoundException(`User with id ${id} doesn't exist`);
    } else if (error instanceof QueryFailedError) {
      throw new BadRequestException('Most provide a valid id');
    }

    throw new InternalServerErrorException();
  }
}
