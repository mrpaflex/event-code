import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './guards/jwt.guard';
import { CreatePlannerDto } from 'src/planner/dto/planner.dto';
import {
  AccountVerifyDTO,
  ForgotPasswordDTO,
  GooglePayload,
  LoginDto,
  ResetPasswordDTO,
} from './dto/auth.dto';
import { IUser, LoginResponse } from './dto/serialize.dto';
import { Serialize } from './interceptor/serialize.interceptor';
import { CurrentUser } from './decorator/current-user-decorator';
import { PlannerDocument } from 'src/planner/schemas/planner.schemas';
import { VendorDocument } from 'src/vendor/schemas/vendor.schema';
import { CreateVendorDto } from 'src/vendor/dto/vendor.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('create-user')
  async createUser(@Body() payload: CreatePlannerDto) {
    return await this.authService.createUser(payload);
  }

  @Public()
  @Post('google')
  async signUpWithGoogle(@Body() payload: GooglePayload) {
    return await this.authService.signUpWithGoogle(payload);
  }

  ///login user endpoint
  @Serialize(LoginResponse)
  @Public()
  @Post('login-user')
  async loginUser(@Body() payload: LoginDto) {
    return await this.authService.loginUser(payload);
  }

  @Serialize(LoginResponse)
  @Public()
  @Post('login-vendor')
  async loginVendor(@Body() payload: LoginDto) {
    return await this.authService.loginVendor(payload);
  }

  //current logged in user
  @Serialize(IUser)
  @Get('current-user')
  async currentLoggedIn(
    @CurrentUser() planner: PlannerDocument | VendorDocument,
  ) {
    return planner;
  }

  //sign up vendor endpoint
  @Public()
  @Post('create-vendor')
  async createVendor(@Body() payload: CreateVendorDto) {
    return await this.authService.createVendor(payload);
  }

  @Public()
  @Post('verify-account')
  async verifyAccount(@Body() payload: AccountVerifyDTO) {
    return await this.authService.verifyAccount(payload);
  }

  //forgot password
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() payload: ForgotPasswordDTO) {
    return await this.authService.forgotPassword(payload);
  }

  //reset password
  @Public()
  @Post('reset-password')
  async restPassword(@Body() payload: ResetPasswordDTO) {
    return await this.authService.resetPassword(payload);
  }
}
