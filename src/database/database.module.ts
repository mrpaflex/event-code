import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ENVIRONMENT } from 'src/common/constants/environment/env.variable';

@Module({
  imports: [MongooseModule.forRoot(ENVIRONMENT.DB.DATABASE)],
})
export class DatabaseModule {}
