import { IsIP, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @IsNumber()
  @IsOptional()
  view: number;

  @IsString()
  @IsOptional()
  os: string;
}
