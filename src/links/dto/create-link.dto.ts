import { IsString, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  @IsUrl()
  urlOriginal: string;
}
