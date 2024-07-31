import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';
import {
  InterestEnum,
  VendorTypesEnum,
  VenueTypesEnum,
} from 'src/common/enum/user-type.enum';

export class Address {
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsOptional()
  @IsNumber()
  zip_code?: number;

  @IsNotEmpty()
  @IsString()
  country?: string;
}
export class BusinessDetails {
  @IsNotEmpty()
  @IsString()
  businessName: string;

  @IsNotEmpty()
  @IsEnum(InterestEnum)
  interest: InterestEnum;

  @IsOptional()
  @IsArray()
  @IsEnum(VenueTypesEnum, { each: true })
  venueTypes?: VenueTypesEnum;

  @IsOptional()
  @IsArray()
  @IsEnum(VendorTypesEnum, { each: true })
  VendorTypes: VendorTypesEnum;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Address)
  businessAddress: Address;
}
export class CreateVendorDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  businessRole: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BusinessDetails)
  businessDetails: BusinessDetails;
}
