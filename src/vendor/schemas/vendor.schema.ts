import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  InterestEnum,
  Role,
  VenueTypesEnum,
} from 'src/common/enum/user-type.enum';
export type VendorDocument = Vendor & Document;

export interface BusinessAddress {
  street?: string;

  city?: string;

  state?: string;

  zip_code?: number;

  country?: string;
}

export interface BusinessDetails {
  businessName: string;

  interest: InterestEnum;

  venueTypes: VenueTypesEnum;

  businessAddress: BusinessAddress;
}

@Schema({ timestamps: true })
export class Vendor {
  @Prop({ type: String })
  userName: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String, required: true })
  businessRole: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: Boolean, required: true, default: false })
  isEmailVerified: boolean;

  @Prop({ type: [String], enum: Role, default: Role.Vendor, required: true })
  roles: Role[];

  @Prop({ type: Object, required: true })
  businessDetails: BusinessDetails;

  @Prop({ type: Boolean, default: false })
  isGoogleAuth: boolean;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
