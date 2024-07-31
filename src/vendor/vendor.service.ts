import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateVendorDto } from './dto/vendor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Vendor, VendorDocument } from './schemas/vendor.schema';
import { Model } from 'mongoose';
import { OtpService } from 'src/otp/otp.service';
import { OtpType } from 'src/otp/enum/otp.enum';
import { GooglePayload, LoginDto } from 'src/auth/dto/auth.dto';
import {
  comparedHashedPassword,
  hashPassword,
} from 'src/common/utils/bcrypt/bcrypt';
import { InterestEnum, VenueTypesEnum } from 'src/common/enum/user-type.enum';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor.name)
    private vendorModel: Model<VendorDocument>,
    private otpService: OtpService,
  ) {}
  async create(payload: CreateVendorDto) {
    const { email, userName, phoneNumber, password, businessDetails } = payload;

    const { interest, venueTypes, VendorTypes } = businessDetails;

    if (interest === InterestEnum.venueOwner) {
      if (VendorTypes) {
        throw new BadRequestException('Check Your Interest Selection');
      }
    }
    if (interest === InterestEnum.Vendor) {
      if (venueTypes) {
        throw new BadRequestException('Check Your Interest Selection');
      }
    }

    const vendor = await this.vendorExist(email, userName, phoneNumber);

    if (vendor && !vendor.isEmailVerified) {
      await this.otpService.sendOtp({
        email: email,
        userName: userName,
        requestType: OtpType.EMAil_VERIFICATION,
      });

      delete vendor['_doc'].password;
      return vendor;
    } else if (vendor && vendor.isEmailVerified) {
      if (
        vendor.email === email ||
        vendor.userName === userName ||
        vendor.phoneNumber === phoneNumber
      ) {
        {
          throw new BadRequestException(
            `Vendor with ${vendor.email === email ? 'email ' + email : vendor.phoneNumber === phoneNumber ? 'phone number ' + phoneNumber : 'username ' + userName} already exists.`,
          );
        }
      }
    }

    const hashedPassword = await hashPassword(password);

    const result = await this.vendorModel.create({
      ...payload,

      password: hashedPassword,
    });

    await this.otpService.sendOtp({
      email: email,
      userName: userName,
      requestType: OtpType.EMAil_VERIFICATION,
    });

    delete result['_doc'].password;
    return result;
  }

  async getByEmail(email: string) {
    const vendor = await this.vendorModel.findOne({ email: email });
    if (!vendor) {
      return;
    }
    return vendor;
  }

  async getById(id: string) {
    const vendor = await this.vendorModel.findOne({ _id: id });
    if (!vendor) {
      return;
    }
    return vendor;
  }

  async vendorExist(email: string, userName: string, phoneNumber: string) {
    const vendor = await this.vendorModel.findOne({
      $or: [{ email }, { userName }, { phoneNumber }],
    });
    if (!vendor) {
      return;
    }

    return vendor;
  }
  async login(payload: LoginDto) {
    const { userName, password } = payload;
    const vendor = await this.getByUsername(userName);

    if ((await comparedHashedPassword(password, vendor.password)) === false) {
      throw new BadRequestException('Incorrect Password');
    }

    if (!vendor.isEmailVerified) {
      throw new UnauthorizedException(
        'You have to verify your account before logging in',
      );
    }

    return vendor;
  }

  async getByUsername(userName: string) {
    const vendor = await this.vendorModel.findOne({ userName: userName });
    if (!vendor) {
      return;
    }
    return vendor;
  }

  async createWithGoogle(payload: GooglePayload) {
    const { email } = payload;
    const vendor = await this.getByEmail(email);

    if (vendor && !vendor.isGoogleAuth) {
      throw new BadRequestException(`Can't Proceed`);
    } else if (vendor && vendor.isGoogleAuth) {
      return vendor;
    }

    const createVendor = await this.vendorModel.create({
      email: email,
      isGoogleAuth: true,
      isEmailVerified: true,
    });

    return createVendor;
  }
}
