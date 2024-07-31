import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Venue, VenueDocument } from './schemas/venue.schema';
import { Model } from 'mongoose';
import { VendorService } from 'src/vendor/vendor.service';
import { CreateVenueDto } from './dto/venue.dto';
import { VendorDocument } from 'src/vendor/schemas/vendor.schema';
import { InterestEnum } from 'src/common/enum/user-type.enum';

@Injectable()
export class VenueService {
  constructor(
    @InjectModel(Venue.name) private venueModel: Model<VenueDocument>,
    private vendorService: VendorService,
  ) {}

  async create(payload: CreateVenueDto, user: VendorDocument) {
    const { name, eventType, location } = payload;

    //check if the vendor is a venue owner
    if (user.businessDetails.interest !== InterestEnum.venueOwner) {
      throw new UnauthorizedException(
        'Only Vendor with Venue Owner roles can upload venues, contact support',
      );
    }

    const venue = await this.venueModel.create({
      ...payload,
      ownerId: user._id,
    });

    return venue;
  }
}
