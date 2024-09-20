import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { LoginDto } from '@auth/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }
}
