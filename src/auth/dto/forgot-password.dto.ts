import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    minLength: 4,
  })
  @IsEmail()
  @IsNotEmpty()
  @MinLength(4)
  email: string;
}
