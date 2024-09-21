import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
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

  async findAll() {
    try {
      const users = await this.userRepository.find();

      return users;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error?.details);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) throw new BadRequestException(`User doesn't exist`);

      return user;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error?.details);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user?.id) {
        throw new BadRequestException(`User doesn't exist`);
      }

      if (updateUserDto?.password) {
        updateUserDto.password = await encryptPassword(updateUserDto.password);
      }

      Object.assign(user, updateUserDto);

      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error?.details);
    }
  }

  async remove(id: string) {
    try {
      return await this.userRepository.delete(id);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error?.details);
    }
  }
}
