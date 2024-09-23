import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '@auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from '@auth/dto';
import { CreateUserDto } from '@users/dto';
import { PRODUCTION } from '@shared/constants/server';
import { GetRefreshToken } from './decorators/get-refreshtoken.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signin')
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiResponse({ status: 200, description: 'Successfully signed in.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async signIn(@Body() credentials: SignInDto, @Res() res: Response) {
    const tokens = await this.authService.signIn(credentials);
    const { accessToken, refreshToken } = tokens;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === PRODUCTION,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.send({ accessToken });
  }

  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const result = await this.authService.signUp(createUserDto);

    const { accessToken, refreshToken, user } = result;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === PRODUCTION,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.send({ accessToken, user });
  }
  @ApiOperation({ summary: 'Refresh the access token' })
  @ApiResponse({ status: 200, description: 'New access token provided.' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  @Get('refresh-token')
  async refreshToken(
    @GetRefreshToken() refreshToken: string,
    @Res() res: Response,
  ) {
    const newTokens = await this.authService.refreshToken(refreshToken);

    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === PRODUCTION,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.send({ accessToken: newTokens.accessToken });
  }
}
