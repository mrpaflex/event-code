import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Venue, VenueSchema } from './schemas/venue.schema';
import { VenueController } from './venue.controller';
import { VenueService } from './venue.service';
import { VendorModule } from 'src/vendor/vendor.module';

@Module({
  imports: [
    VendorModule,
    MongooseModule.forFeature([{ name: Venue.name, schema: VenueSchema }]),
  ],
  controllers: [VenueController],
  providers: [VenueService],
  exports: [VenueService],
})
export class VenueModule {}
