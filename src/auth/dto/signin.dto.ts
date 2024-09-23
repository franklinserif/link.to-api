import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
    minLength: 2,
    maxLength: 16,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  @IsNotEmpty()
  username: string;

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
  password: string;
}
