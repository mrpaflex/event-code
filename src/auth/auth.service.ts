import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/otp/otp.service';
import { CreatePlannerDto } from 'src/planner/dto/planner.dto';
import { PlannerService } from 'src/planner/service/planner.service';
import { VendorService } from 'src/vendor/vendor.service';
import {
  AccountVerifyDTO,
  ForgotPasswordDTO,
  GooglePayload,
  LoginDto,
  ResetPasswordDTO,
} from './dto/auth.dto';
import { CreateVendorDto } from 'src/vendor/dto/vendor.dto';
import { UserTypeENUM } from 'src/common/enum/user-type.enum';
import { OtpType } from 'src/otp/enum/otp.enum';
import { hashPassword } from 'src/common/utils/bcrypt/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: PlannerService,
    private jwtService: JwtService,
    private vendorService: VendorService,
    private optService: OtpService,
  ) {}

  async createUser(payload: CreatePlannerDto) {
    return await this.userService.create(payload);
  }

  async loginUser(payload: LoginDto) {
    const user = await this.userService.login(payload);
    const token = await this.jwtAccessToken(user);

    return { user: user, accessToken: token };
  }

  async createVendor(payload: CreateVendorDto) {
    return await this.vendorService.create(payload);
  }

  async loginVendor(payload: LoginDto) {
    const vendor = await this.vendorService.login(payload);
    const token = await this.jwtAccessToken(vendor);

    return {
      vendor: vendor,
      accessToken: token,
    };
  }

  async verifyAccount(payload: AccountVerifyDTO) {
    const { email, code, userType } = payload;

    let user: any;
    if (userType === UserTypeENUM.planner) {
      const userExist = await this.userService.getUserByEmail(email);
      if (!userExist) {
        throw new NotFoundException('User Not Found');
      }
      user = userExist;
    } else if (userType === UserTypeENUM.vendor) {
      const userExist = await this.vendorService.getByEmail(email);
      if (!userExist) {
        throw new NotFoundException('User Not Found');
      }
    }

    await this.optService.verifyOtp({
      email: email,
      code: code,
      requestType: OtpType.EMAil_VERIFICATION,
    });

    user.isEmailVerified = true;

    await user.save();
    return `Account is now Verified`;
  }
  async forgotPassword(payload: ForgotPasswordDTO) {
    const { email, userType } = payload;
    let user: any;
    if (userType === UserTypeENUM.planner) {
      user = await this.userService.getUserByEmail(email);
    } else if (userType === UserTypeENUM.vendor) {
      user = await this.vendorService.getByEmail(email);
    }

    await this.optService.sendOtp({
      email: email,
      requestType: OtpType.RESET_PASSWORD,
      userName: user.userName,
    });

    return 'OTP sent';
  }

  async resetPassword(payload: ResetPasswordDTO) {
    const { email, code, userType, newPassword } = payload;

    let user: any;
    if (userType === UserTypeENUM.planner) {
      user = await this.userService.getUserByEmail(email);
    } else if (userType === UserTypeENUM.vendor) {
      user = await this.vendorService.getByEmail(email);
    }

    await this.optService.verifyOtp({
      email: email,
      code: code,
      requestType: OtpType.RESET_PASSWORD,
    });

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;

    await user.save();
    return 'password changed';
  }

  async getByJwtToken(id: string) {
    const [user, vendor] = await Promise.all([
      this.userService.getById(id),
      this.vendorService.getById(id),
    ]);

    const IUser = user || vendor;

    return IUser;
  }

  async jwtAccessToken(payload: any) {
    payload = {
      _id: payload._id,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };

    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }

  async signUpWithGoogle(payload: GooglePayload) {
    const { type } = payload;
    if (type === UserTypeENUM.planner) {
      return await this.signUpPlannerWithGoogle(payload);
    } else if (type === UserTypeENUM.vendor) {
      return await this.signUpVendorWithGoogle(payload);
    }
    return;
  }

  async signUpPlannerWithGoogle(payload: GooglePayload) {
    return await this.userService.createWithGoogle(payload);
  }

  async signUpVendorWithGoogle(payload: GooglePayload) {
    return await this.vendorService.createWithGoogle(payload);
  }
}
