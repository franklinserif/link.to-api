import { Link } from '@links/entities/link.entity';
import { IsIP, IsOptional, IsString } from 'class-validator';

export class CreateVisitDto {
  @IsString()
  @IsOptional()
  browser: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsOptional()
  @IsIP()
  ip: string;

  @IsString()
  @IsOptional()
  os: string;

  link: Link;
}
