import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GenderEnum, Role } from 'src/common/enum/user-type.enum';

export interface profilePhoto {
  Location: string;
  Key: string;
}

export interface State_Of_Origin {
  state: string;
  local_government: string;
}
export interface AddressInterface {
  country: string;
  lga: string;
  zipCode: number;
  providence: string;
  city: string;
  street_address: string;
}

export type PlannerDocument = Planner & Document;
@Schema({ timestamps: true })
export class Planner {
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String })
  name?: string;

  @Prop({ type: String })
  userName?: string;

  @Prop({ type: Object })
  profilePhoto?: profilePhoto;

  @Prop({ type: String, unique: true })
  phoneNumber?: string;

  @Prop({ type: String })
  refreshToken?: string;

  @Prop({ type: String })
  password?: string;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({ type: [String], enum: Role, default: Role.Planner, required: true })
  roles: Role[];

  @Prop({ type: Boolean, default: false })
  isPlannerSuspended: boolean;

  @Prop({ type: Boolean, default: false })
  isGoogleAuth: boolean;

  @Prop({ type: Object })
  state_of_origin?: State_Of_Origin;

  @Prop({ type: Object })
  address?: AddressInterface;

  @Prop({ type: String, default: '19XX-month-day' })
  date_of_birth?: string;

  @Prop({ type: String, enum: GenderEnum, default: GenderEnum.Unspecified })
  sex?: GenderEnum;
}

export const PlannerSchema = SchemaFactory.createForClass(Planner);
