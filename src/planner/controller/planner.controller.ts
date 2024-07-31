import {
  Body,
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from 'src/common/utils/aws-bucket/upload.sharp';
import { CurrentUser } from 'src/auth/decorator/current-user-decorator';
import { Serialize } from 'src/auth/interceptor/serialize.interceptor';
import { IUser } from 'src/auth/dto/serialize.dto';
import { PlannerService } from '../service/planner.service';
import { PlannerDocument } from '../schemas/planner.schemas';
import { UpdatePlannerProfileDto } from '../dto/planner.dto';

@Controller('planner')
export class PlannerController {
  constructor(private plannerService: PlannerService) {}

  //testing.. will be removed later or move to admin controller
  // @Public()
  @Get()
  async getAll() {
    return this.plannerService.getAll();
  }

  @UseInterceptors(FileInterceptor('image'))
  @Patch('photo')
  async uploadPhoto(
    @CurrentUser() planner: PlannerDocument,
    @UploadedFile(SharpPipe) image: Express.Multer.File,
  ) {
    return await this.plannerService.profilePhoto(planner, image);
  }

  @Serialize(IUser)
  @UseInterceptors(FileInterceptor('image'))
  @Patch('update')
  async updateProfile(
    @CurrentUser() planner: PlannerDocument,
    @Body() payload: UpdatePlannerProfileDto,
  ) {
    return await this.plannerService.updateProfile(planner, payload);
  }
}
