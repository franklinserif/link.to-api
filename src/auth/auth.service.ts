import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@users/dto';
import { SignInDto } from '@auth/dto';
import { User } from '@users/entities/user.entity';
import { comparePassword, encryptPassword } from '@libs/encrypt';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly usersRepsitory: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    try {
      const user = await this.usersRepsitory.findOne({
        where: { username: signInDto.username.toLocaleLowerCase().trim() },
        select: { id: true, password: true },
      });

      if (!user?.id) {
        throw new UnauthorizedException(
          `User with username ${signInDto.username} doesn't exist`,
        );
      }
      const isPasswordsMatch = comparePassword(
        user.password,
        signInDto.password,
      );

      if (!isPasswordsMatch) {
        throw new UnauthorizedException('Incorrect user password');
      }

      const token = await this.jwtService.signAsync({ id: user.id });

      return {
        token,
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async signUp(createUserDto: CreateUserDto) {
    const { password, ...userDetails } = createUserDto;

    try {
      const encryptedPassword = await encryptPassword(password);
      const user = this.usersRepsitory.create({
        ...userDetails,
        password: encryptedPassword,
      });

      await this.usersRepsitory.save(user);
      const token = await this.jwtService.signAsync({ id: user.id });

      return {
        user,
        token,
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
