import {
  BadRequestException,
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';

//import * as sharp from 'sharp';

@Injectable()
export class SharpPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(file: Express.Multer.File): Promise<any> {
    if (!file || !file.buffer) {
      throw new BadRequestException('Invalid image provided');
    }

    if (file.size > 10000000) {
      throw new UnauthorizedException('Can only upload 10MB or less file size');
    }

    const filename = Date.now() + '-' + file.originalname;
    const splitName = file.originalname.split('.');
    const ext = splitName[1].toLocaleLowerCase();

    const allowedImageTypes = ['jpg', 'jpeg', 'png', 'webp'];
    const allowedVideoTypes = ['mp4', 'mov'];

    if (allowedImageTypes.includes(ext)) {
      return { buffer: file.buffer, filename: filename };
      // const imageNewSize = await this.processImage(file.buffer, filename);

      // return imageNewSize;
    } else if (allowedVideoTypes.includes(ext)) {
      return { buffer: file.buffer, filename: filename };
    } else {
      throw new BadRequestException(`Unsupported file format: ${ext}`);
    }
  }

  // private async processImage(buffer: Buffer, filename: string): Promise<any> {
  //   const newFile = await sharp(buffer)
  //     .resize(800)
  //     .webp({ quality: 80 })
  //     .toBuffer();

  //   return { buffer: newFile, filename: filename };
  // }
}
