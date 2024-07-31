import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/venue.dto';
import { CurrentUser } from 'src/auth/decorator/current-user-decorator';
import { VendorDocument } from 'src/vendor/schemas/vendor.schema';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/common/enum/user-type.enum';

@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Vendor)
  @Post()
  async create(
    @Body() payload: CreateVenueDto,
    @CurrentUser() user: VendorDocument,
  ) {
    return await this.venueService.create(payload, user);
  }
}
