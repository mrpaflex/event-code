import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VendorService } from 'src/vendor/vendor.service';
import { VendorDocument } from 'src/vendor/schemas/vendor.schema';
import { InterestEnum } from 'src/common/enum/user-type.enum';
import { Venue, VenueDocument } from './schemas/venue.schema';
import { CreateVenueDto, FindVenueDto } from './dto/venue.dto';

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

  async findVenue(query?: FindVenueDto): Promise<VenueDocument[]> {
    const { keyword = '', page = 1, pageSize = 10 } = query || {};
    const currentPage = Number(page) > 0 ? Number(page) : 1;
    const size = Number(pageSize) > 0 ? Number(pageSize) : 10;
    const skip = size * (currentPage - 1);

    const keywordConditions = keyword
      ? {
          $or: [
            { location: { $regex: keyword, $options: 'i' } },
            { name: { $regex: keyword, $options: 'i' } },
            { eventType: { $regex: keyword, $options: 'i' } },
            { capacity: { $regex: keyword, $options: 'i' } },
          ],
        }
      : {};

    const numericKeyword = Number(keyword);

    const numericConditions = !isNaN(numericKeyword)
      ? {
          price: { $gte: numericKeyword * 0.9, $lte: numericKeyword * 1.1 },
        }
      : {};

    return await this.venueModel
      .find({
        $and: [{ ...numericConditions }, { ...keywordConditions }],
      })
      .limit(size)
      .skip(skip)
      .exec();
  }
}
