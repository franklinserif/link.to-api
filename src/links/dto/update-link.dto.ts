import { IsString, IsUrl } from 'class-validator';

export class UpdateLinkDto {
  @IsString()
  @IsUrl()
  urlOriginal: string;
}
