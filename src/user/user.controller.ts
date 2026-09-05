import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Post('register')
  register(
    @Body()
    registerData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
  ) {
    return this.userService.register(registerData);
  }
  @Post('verify-otp')
  verifyOtp(@Body() otpData: VerifyOtpDto) {
    return this.userService.verifyOtp(otpData);
  }
  @Post('login')
  login(@Body() loginData: LoginDto) {
    return this.userService.login(loginData);
  }
}