import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    minLength: 4,
  })
  @IsEmail()
  @IsNotEmpty()
  @MinLength(4)
  email: string;

  @ApiProperty({
    description:
      'The password of the user. Must contain at least one number and one uppercase letter.',
    example: 'P@ssw0rd',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @Matches(/(?=.*\d)(?=.*[A-Z])/, {
    message:
      'Password must contain at least one number and one uppercase letter',
  })
  newPassword: string;

  @ApiProperty({
    description: 'OTP code for reset password',
    example: 1242342,
  })
  @IsNumber()
  @IsNotEmpty()
  otp: number;
}
