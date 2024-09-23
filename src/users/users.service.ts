  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
      this.logger.error(error.detail);
      throw new InternalServerErrorException(error?.detail);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user)
        throw new NotFoundException(`User with id ${id} doesn't exist`);

      return user;
    } catch (error) {
      this.logger.error(error.detail);
      throw new InternalServerErrorException(error.detail);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
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
      this.logger.error(`Failed to update user with id ${id}`, error.detail);
      throw new InternalServerErrorException(
        `Failed to update user with id ${id}`,
        error.detail,
      );
    }
  }

  async remove(id: string) {
    try {
      return await this.userRepository.delete(id);
    } catch (error) {
      this.logger.error(`Failed to delete user with id ${id} `, error);
      throw new InternalServerErrorException(
        `Failed to delete user with id ${id} `,
        error?.detail,
      );
    }
  }
}
