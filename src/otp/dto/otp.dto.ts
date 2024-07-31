import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OtpType } from '../enum/otp.enum';

export class CreateOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  code: number;

  @IsNotEmpty()
  @IsEnum(OtpType)
  requestType: OtpType;
}

export class SendOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsEnum(OtpType)
  @IsNotEmpty()
  requestType: OtpType;

  @IsString()
  @IsOptional()
  userName?: string;
}

export class VerifyOtpDto extends CreateOtpDto {}

export class ValidateOtpDto extends VerifyOtpDto {}
