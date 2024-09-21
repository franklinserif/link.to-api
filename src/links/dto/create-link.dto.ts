import { IsNotEmpty, IsUrl, MinLength } from 'class-validator';

export class CreateLinkDto {
  @IsUrl()
  @IsNotEmpty()
  @MinLength(4)
  urlOriginal: string;
}
