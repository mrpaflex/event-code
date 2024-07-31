import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vendor, VendorSchema } from './schemas/vendor.schema';
import { OtpModule } from 'src/otp/otp.module';

@Module({
  imports: [
    OtpModule,
    MongooseModule.forFeature([
      {
        name: Vendor.name,
        schema: VendorSchema,
      },
    ]),
  ],
  controllers: [VendorController],
  providers: [VendorService],
  exports: [VendorService],
})
export class VendorModule {}
