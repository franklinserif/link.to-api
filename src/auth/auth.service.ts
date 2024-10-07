import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@users/dto';
import { SignInDto } from '@auth/dto';
import { User } from '@users/entities/user.entity';
import { Tokens, SignupResponse } from '@auth/interfaces';
import { comparePassword, encryptPassword } from '@libs/encrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepsitory: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<Tokens> {
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

      return await this.createTokens(user);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`User doesn't exist`);
      } else if (error instanceof QueryFailedError) {
        throw new BadRequestException('Most provide a valid id');
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error);
      }

      throw new InternalServerErrorException();
    }
  }

  async signUp(createUserDto: CreateUserDto): Promise<SignupResponse> {
    const { password, ...userDetails } = createUserDto;

    try {
      const encryptedPassword = await encryptPassword(password);
      const user = this.usersRepsitory.create({
        ...userDetails,
        password: encryptedPassword,
      });

      await this.usersRepsitory.save(user);
      const tokens = await this.createTokens(user);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create account');
    }
  }

  private async createTokens(user: User): Promise<Tokens> {
    try {
      const payload = { id: user.id };

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create access token and refresh token',
      );
    }
  }

  async refreshToken(refreshToken: string | undefined): Promise<Tokens> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const user = await this.usersRepsitory.findOne({
        where: { id: payload?.id },
      });

      if (!user) {
        throw new NotFoundException(`user with id ${payload.id} doesn't exist`);
      }

      const tokens = await this.createTokens(user);

      return tokens;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error);
      }

      throw new InternalServerErrorException('Failed to create new tokens');
    }
  }
}
