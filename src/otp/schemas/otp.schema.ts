import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OtpType } from '../enum/otp.enum';

export type OtpDocument = Otp & Document;
@Schema()
export class Otp {
  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, enum: OtpType, required: true })
  requestType: OtpType;

  @Prop({ required: true })
  code: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({
    type: Date,
    default: () => new Date(Date.now() + 60 * 60 * 1000),
    expires: '1h',
  })
  expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
