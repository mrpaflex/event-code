import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ENVIRONMENT } from 'src/common/constants/environment/env.variable';

const { TTL, LIMIT } = ENVIRONMENT.THROTTLE;
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: +TTL,
        limit: +LIMIT,
      },
    ]),
  ],
})
export class AuthThrottlerModule {}
