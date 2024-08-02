import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VenueService } from './venue.service';
import { CurrentUser } from 'src/auth/decorator/current-user-decorator';
import { VendorDocument } from 'src/vendor/schemas/vendor.schema';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/common/enum/user-type.enum';
import { CreateVenueDto, FindVenueDto } from './dto/venue.dto';
import { VenueDocument } from './schemas/venue.schema';
import { Public } from 'src/auth/guards/jwt.guard';

@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Vendor)
  @Post()
  async create(
    @Body() payload: CreateVenueDto,
    @CurrentUser() vendor: VendorDocument,
  ) {
    return await this.venueService.create(payload, vendor);
  }

  @Public()
  @Get('find-venue')
  async findVenue(@Query() payload?: FindVenueDto): Promise<VenueDocument[]> {
    return await this.venueService.findVenue(payload);
  }

  @Public()
  @Get('find-one/:venueId')
  async getById(@Param('venueId') venueId: string) {
    return await this.venueService.getById(venueId);
  }
}
