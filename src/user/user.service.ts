import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
import { LoginDto } from './dto/login.dto.js';
import * as bcrypt from 'bcrypt';
import { Resend } from 'resend';


@Injectable()
export class UserService {
  private readonly resend = new Resend(process.env.RESEND_API_KEY);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(registerData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    // Check email
    const existingUser = await this.userRepository.findOne({
      where: {
        email: registerData.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user
    const user = this.userRepository.create({
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
      password: hashedPassword,
      otp: otp,
    });

    await this.userRepository.save(user);

    // Send OTP through Resend
    const { error } = await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'g35231861@gmail.com',
      subject: 'Your Verification OTP',
      html: `
        <h2>Email Verification</h2>
        <p>Hello ${registerData.firstName},</p>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>This OTP is used to verify your email.</p>
      `,
    });

    if (error) {
      throw new BadRequestException('OTP email could not be sent');
    }

    return {
      message: 'Registration successful. OTP sent to your email.',
      userId: user.id,
    };
  }


  async verifyOtp(otpData:VerifyOtpDto) {
  const { email, otp } = otpData;

  const user = await this.userRepository.findOne({
    where: { email },
  });

  if (!user) {
    return {
      success: false,
      message: 'User not found',
    };
  }

  if (user.otp !== otp) {
    return {
      success: false,
      message: 'Invalid OTP',
    };
  }

  // OTP verify hone ke baad OTP remove kar dein
  user.otp = '';
  await this.userRepository.save(user);

  return {
    success: true,
    message: 'OTP verified successfully',
    userId: user.id,
  };
}
async login(loginData: LoginDto) {
  const { email, password } = loginData;

  const user = await this.userRepository.findOne({
    where: { email },
  });

  if (!user) {
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password,
  );

  if (!isPasswordValid) {
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }

  return {
    success: true,
    message: 'Login successful',
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
}
}