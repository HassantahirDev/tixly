import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Role } from '@prisma/client';
import { MailerService } from 'src/mailer/mailer.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const { email, password } = signUpDto;

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists in user');
      }

      const existingOrganizer = await this.prisma.organizer.findUnique({
        where: { email },
      });

      if (existingOrganizer) {
        throw new ConflictException('Email already exists in organizer');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationCode = Math.floor(
        1000 + Math.random() * 9000,
      ).toString();
      let user;

      if (signUpDto.role === Role.USER) {
        user = await this.prisma.user.create({
          data: {
            name: signUpDto.name,
            email: signUpDto.email,
            password: hashedPassword,
            verificationCode,
          },
        });
      } else {
        user = await this.prisma.organizer.create({
          data: {
            name: signUpDto.name,
            email: signUpDto.email,
            password: hashedPassword,
            verificationCode,
          },
        });
      }

      await this.mailerService.sendEmail(
        email,
        'OTP for verification',
        verificationCode,
      );

      return {
        success: true,
        message: 'Verification code sent to your email',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error during signup process');
    }
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    try {
      const { email, password } = updatePasswordDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      let user;
      if (updatePasswordDto.role === Role.USER) {
      user = await this.prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });
    } else {
      user = await this.prisma.organizer.update({
        where: { email },
        data: { password: hashedPassword },
      });
    }

    return {
        success: true,
        message: 'Password updated successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      throw new BadRequestException('Error during update password process');
    }
  }

  async sendVerificationCode(sendOtpDto: SendOtpDto) {
    try {
      const { email, role } = sendOtpDto;
      const verificationCode = Math.floor(
        1000 + Math.random() * 9000,
      ).toString();
      let user;

      if (role === Role.USER) {
        user = await this.prisma.user.update({
          where: { email },
          data: { verificationCode },
        });
      } else {
        user = await this.prisma.organizer.update({
          where: { email },
          data: { verificationCode },
        });
      }

      await this.mailerService.sendEmail(
        email,
        'OTP for verification',
        verificationCode,
      );

      return {
        success: true,
        message: 'Verification code sent to your email',
        data: {
          id: user.id,
          name: user.name,
          email,
        },
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `User with email ${sendOtpDto.email} not found`,
        );
      }
      throw new BadRequestException('Error sending verification code');
    }
  }

  async checkValidityOfToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      const { email, code, role } = verifyOtpDto;
      let user;

      if (role === Role.USER) {
        user = await this.prisma.user.findUnique({
          where: { email },
        });
      } else {
        user = await this.prisma.organizer.findUnique({
          where: { email },
        });
      }

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      if (user.verificationCode !== code) {
        throw new UnauthorizedException('Invalid verification code');
      }

      if (role === Role.USER) {
        await this.prisma.user.update({
          where: { email },
          data: { isVerified: true },
        });
      } else {
        await this.prisma.organizer.update({
          where: { email },
          data: { isVerified: true },
        });
      }

      return {
        success: true,
        message: 'Email verified successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Error verifying OTP');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password, role } = loginDto;

      let user;
      if (role === Role.USER) {
        user = await this.prisma.user.findUnique({
          where: { email },
        });
      } else if(role === Role.ORGANIZER) {
        user = await this.prisma.organizer.findUnique({
          where: { email },
        });
      }else if(role === Role.ADMIN) {
        user = await this.prisma.admin.findUnique({
          where: { email },
        });
      }

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isVerified) {
        throw new UnauthorizedException('Email not verified');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { sub: user.id, email: user.email, role };
      return {
        success: true,
        message: 'Login successful',
        data: {
          access_token: this.jwtService.sign(payload),
          name: user.name,
          email: user.email,
          role,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Error during login process');
    }
  }
}
