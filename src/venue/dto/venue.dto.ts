import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVenueDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  venueType: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  eventType: string;

  @IsNotEmpty()
  @IsString()
  capacity: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  isNegotiable?: boolean;
}

export class FindVenueDto {
  @IsString()
  @IsOptional()
  keyword?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageSize?: number; // Include pageSize for dynamic page size
}
