import { Module } from '@nestjs/common';
import { PlannerModule } from './planner/module/planner.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';
import { MailModule } from './mail/mail.module';
import { VendorModule } from './vendor/vendor.module';
import { VenueModule } from './venue/venue.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthThrottlerModule } from './throttler/auth.throller';

@Module({
  imports: [
    PlannerModule,
    DatabaseModule,
    AuthModule,
    OtpModule,
    MailModule,
    VendorModule,
    VenueModule,
    AuthThrottlerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
