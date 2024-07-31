import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GenderEnum } from 'src/common/enum/user-type.enum';

export class CreatePlannerDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  //@IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsString()
  userName?: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber?: string;
}

export class State_Of_Origin {
  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  local_government: string;
}
export class AddressInterface {
  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  lga: string;

  @IsOptional()
  @IsNumber()
  zipCode: number;

  @IsOptional()
  @IsString()
  providence: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  street_address: string;
}
export class UpdatePlannerProfileDto {
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsDateString()
  date_of_birth: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => State_Of_Origin)
  state_of_origin: State_Of_Origin;

  @ValidateNested()
  @IsOptional()
  @Type(() => AddressInterface)
  address: AddressInterface;

  @IsEnum(GenderEnum)
  @IsOptional()
  sex: GenderEnum;
}
