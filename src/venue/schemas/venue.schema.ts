import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type VenueDocument = Venue & Document;
@Schema()
export class Venue {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  venueType: string;

  @Prop({ type: String, required: true })
  location: string;

  @Prop({ type: String, required: true })
  eventType: string;

  @Prop({ type: String, required: true })
  capacity: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Boolean, default: false })
  isNegotiable?: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true })
  ownerId: mongoose.Types.ObjectId;

  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const VenueSchema = SchemaFactory.createForClass(Venue);
