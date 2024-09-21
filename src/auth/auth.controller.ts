import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { SignInDto } from '@auth/dto';
import { CreateUserDto } from '@users/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() credentials: SignInDto) {
    return await this.authService.signIn(credentials);
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }
}
