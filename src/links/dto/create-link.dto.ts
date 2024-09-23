import { IsNotEmpty, IsUrl, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLinkDto {
  @ApiProperty({
    description: 'The original URL that the user wants to shorten',
    example: 'https://example.com',
    minLength: 4,
  })
  @IsUrl()
  @IsNotEmpty()
  @MinLength(4)
  urlOriginal: string;
}
