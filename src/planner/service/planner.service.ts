import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlannerDto, UpdatePlannerProfileDto } from '../dto/planner.dto';
import {
  comparedHashedPassword,
  hashPassword,
} from 'src/common/utils/bcrypt/bcrypt';
import { OtpService } from 'src/otp/otp.service';
import { OtpType } from 'src/otp/enum/otp.enum';
import { GooglePayload, LoginDto } from 'src/auth/dto/auth.dto';
import { uploadFiles } from 'src/common/utils/aws-bucket/upload-file-aws.util';
import { Planner, PlannerDocument } from '../schemas/planner.schemas';

@Injectable()
export class PlannerService {
  constructor(
    @InjectModel(Planner.name)
    private plannerModel: Model<PlannerDocument>,
    private otpService: OtpService,
  ) {}

  async create(payload: CreatePlannerDto) {
    const { email, phoneNumber, userName, password } = payload;

    const user = await this.findUserExist(email, phoneNumber, userName);

    if (user && !user.isEmailVerified) {
      await this.otpService.sendOtp({
        email: email,
        userName: userName,
        requestType: OtpType.EMAil_VERIFICATION,
      });

      delete user['_doc'].password;

      return user;
    } else if (user && user.isEmailVerified) {
      if (
        user.email === email ||
        user.phoneNumber === phoneNumber ||
        user.userName === userName
      ) {
        throw new BadRequestException(
          `User with ${user.email === email ? 'email ' + email : user.phoneNumber === phoneNumber ? 'phone number ' + phoneNumber : 'username ' + userName} already exists.`,
        );
      }
    }

    const hashedPassword = await hashPassword(password);

    const result = await this.plannerModel.create({
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

  async login(payload: LoginDto) {
    const { userName, password } = payload;
    const user = await this.getUserByUserName(userName);

    if ((await comparedHashedPassword(password, user.password)) === false) {
      throw new BadRequestException('Incorrect Password');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'You have to verify your account before logging in',
      );
    }

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.plannerModel.findOne({ email: email });
    if (!user) {
      return;
    }
    return user;
  }

  async getUserByUserName(userName: string): Promise<PlannerDocument> {
    const user = await this.plannerModel.findOne({ userName: userName });
    if (!user) {
      throw new BadRequestException(`User with username ${userName} not found`);
    }
    return user;
  }

  async getById(id: string) {
    const user = await this.plannerModel.findById(id);
    if (!user) {
      return;
    }
    return user;
  }

  async findUserExist(email: string, phoneNumber: string, userName: string) {
    const user = await this.plannerModel.findOne({
      $or: [
        { email: email },
        { phoneNumber: phoneNumber },
        { userName: userName },
      ],
    });
    if (!user) {
      return;
    }

    return user;
  }

  async getAll() {
    return await this.plannerModel.find().lean();
  }

  async createWithGoogle(payload: GooglePayload) {
    const { email } = payload;
    const planner = await this.getUserByEmail(email);

    if (planner && !planner.isGoogleAuth) {
      throw new BadRequestException(`Can't Proceed`);
    }

    if (planner && planner.isGoogleAuth) {
      return planner;
    }

    const createPlanner = await this.plannerModel.create({
      email: email,
      isGoogleAuth: true,
      isEmailVerified: true,
    });

    return createPlanner;
  }

  async profilePhoto(planner: PlannerDocument, image: Express.Multer.File) {
    const awsImage = await uploadFiles(image);

    const { Location, Key } = awsImage;

    planner.profilePhoto = { Location, Key };

    await planner.save();
    return 'profile photo uploaded';
  }

  async updateProfile(
    planner: PlannerDocument,
    payload: UpdatePlannerProfileDto,
  ) {
    const { userName } = payload;

    if (userName) {
      const userNameExist = await this.plannerModel.countDocuments({
        userName: userName,
        _id: { $ne: planner._id },
      });

      if (userNameExist) {
        throw new BadRequestException(
          `username ${userName} has been taken already`,
        );
      }
    }

    const updatedDetails = await this.plannerModel.findOneAndUpdate(
      { _id: planner._id },
      { ...payload },
      { new: true },
    );

    return updatedDetails;
  }
}
