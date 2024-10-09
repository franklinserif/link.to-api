import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@users/dto';
import { SignInDto } from '@auth/dto';
import { User } from '@users/entities/user.entity';
import { Tokens, SignupResponse } from '@auth/interfaces';
import { comparePassword, encryptPassword } from '@libs/encrypt';
import { ErrorManager } from '@shared/exceptions/ExceptionManager';
import { MailsService } from '@mails/mails.service';
import { generateOTP } from '@libs/code';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepsitory: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailsService: MailsService,
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
      throw new ErrorManager(error);
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
      throw new ErrorManager(error, 'Failed to create new user');
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
      throw new ErrorManager(error, 'Failed to create refresh token');
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
      throw new ErrorManager(error, 'failed to refresh token');
    }
  }

  async createOTP(email: string) {
    try {
      const user = await this.usersRepsitory.findOne({ where: { email } });

      if (!user?.id) throw new NotFoundException('user not found');

      const otp = generateOTP();

      user.otp = otp;

      await this.usersRepsitory.save(user);

      return user;
    } catch (error) {
      throw new ErrorManager(error);
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.createOTP(email);

      const result = await this.mailsService.sendResetPassword({
        email: user.email,
        name: user.firstName,
        code: `${user.otp}`,
      });

      return result;
    } catch (error) {
      throw new ErrorManager(error);
    }
  }

  async resetPassword({
    email,
    newPassword,
    otp,
  }: {
    email: string;
    newPassword: string;
    otp: number;
  }) {
    try {
      const user = await this.usersRepsitory.findOne({
        where: { email },

        select: {
          id: true,
          password: true,
          firstName: true,
          otp: true,
        },
      });

      if (!user?.id) throw new NotFoundException('user not found');

      if (user.otp !== otp)
        throw new BadRequestException('the otp code is not valid');

      const encryptedPassword = await encryptPassword(newPassword);

      user.password = encryptedPassword;
      user.otp = null;

      await this.usersRepsitory.save(user);

      return { message: 'reset password completed' };
    } catch (error) {
      throw new ErrorManager(error);
    }
  }
}
