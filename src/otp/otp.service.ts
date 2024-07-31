import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Otp, OtpDocument } from './schemas/otp.schema';
import { Model } from 'mongoose';
import {
  CreateOtpDto,
  SendOtpDto,
  ValidateOtpDto,
  VerifyOtpDto,
} from './dto/otp.dto';
import { OtpType } from './enum/otp.enum';
import {
  resetPasswordMessage,
  welcomeMessage,
} from 'src/common/constants/message-response/welcome.message';
import { MailService } from 'src/mail/mail.service';
import { generateOTP } from './code/otp-generate';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private mailService: MailService,
  ) {}

  async createOtp(payload: CreateOtpDto) {
    const { email, requestType } = payload;

    const otpExist = await this.otpModel.findOne({
      email,
      requestType,
    });

    if (!otpExist) {
      return await this.otpModel.create({ ...payload });
    }

    return await this.otpModel.findByIdAndUpdate(
      {
        _id: otpExist._id,
      },
      { ...payload },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async sendOtp(payload: SendOtpDto): Promise<any> {
    const { email, requestType, userName } = payload;

    const code = generateOTP();

    let template: any;
    let subject: any;

    if (requestType === OtpType.EMAil_VERIFICATION) {
      template = await welcomeMessage(code, userName);
      subject = `Account Verification`;
    }

    if (requestType === OtpType.RESET_PASSWORD) {
      template = await resetPasswordMessage(userName, code);
      subject = `Reset Password`;
    }

    const otp = await this.createOtp({
      email,
      code,
      requestType,
    });

    if (!otp) {
      throw new InternalServerErrorException('error while generating otp');
    }

    await this.mailService.sendMail(email, subject, template);

    return 'otp sent';
  }

  async validateOtp(payload: ValidateOtpDto) {
    const { email, requestType, code } = payload;

    const otpExist = await this.otpModel.findOne({
      code,
      email,
      requestType,
    });

    if (!otpExist) {
      throw new NotFoundException('you code has either expired or not active');
    }
    return otpExist;
  }

  async verifyOtp(payload: VerifyOtpDto) {
    const { email, requestType, code } = payload;

    const otp = await this.validateOtp({ code, email, requestType });

    await this.deleteOTP(otp._id.toString());
    return true;
  }

  async deleteOTP(id: string) {
    return await this.otpModel.findByIdAndDelete(id);
  }
}
