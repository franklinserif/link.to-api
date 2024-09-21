import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(2)
  @MaxLength(15)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(15)
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(4)
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @Matches(/(?=.*\d)(?=.*[A-Z])/, {
    message:
      'Password must contain at least one number and one uppercase letter',
  })
  password: string;
}
