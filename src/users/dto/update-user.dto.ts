import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from '@users/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'The username of the user (optional)',
    example: 'john_doe',
  })
  username?: string;

  @ApiPropertyOptional({
    description: 'The first name of the user (optional)',
    example: 'John',
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'The last name of the user (optional)',
    example: 'Doe',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'The email of the user (optional)',
    example: 'john.doe@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'The password of the user (optional)',
    example: 'P@ssw0rd',
  })
  password?: string;
}
