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
import { GoogleOAuthDto } from './dto/google-oauth.dto';

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
      const { email, password, role  } = loginDto;

      let userRole = role

      let user;
      if (userRole === Role.USER) {
        user = await this.prisma.user.findUnique({
          where: { email },
        });
        if (user?.isAdmin === true) {
          userRole = Role.ADMIN;
        }
      } else if(userRole === Role.ORGANIZER) {
        user = await this.prisma.organizer.findUnique({
          where: { email },
        });
      }else if(userRole === Role.ADMIN) {
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

      const payload = { sub: user.id, email: user.email, role: userRole };
      return {
        success: true,
        message: 'Login successful',
        data: {
          access_token: this.jwtService.sign(payload),
          name: user.name,
          email: user.email,
          role: userRole,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Login error:', error);
      throw new BadRequestException('Error during login process');
    }
  }

  async googleLogin(googleUser: any) {
    try {
      const { googleId, email, name, profilePic } = googleUser;
      
      // Check if user exists with this email
      let user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        // If user exists but doesn't have Google ID, update it
        if (!user.googleId) {
          user = await this.prisma.user.update({
            where: { email },
            data: {
              googleId,
              isGoogleAuth: true,
              isVerified: true, // Google accounts are automatically verified
              profilePic: profilePic || user.profilePic,
            },
          });
        }
      } else {
        // Create new user with Google OAuth
        user = await this.prisma.user.create({
          data: {
            email,
            name,
            googleId,
            profilePic,
            isGoogleAuth: true,
            isVerified: true, // Google accounts are automatically verified
          },
        });
      }

      const payload = { 
        sub: user.id, 
        email: user.email, 
        role: user.isAdmin ? Role.ADMIN : Role.USER 
      };

      return {
        success: true,
        message: 'Google login successful',
        data: {
          access_token: this.jwtService.sign(payload),
          name: user.name,
          email: user.email,
          role: user.isAdmin ? Role.ADMIN : Role.USER,
          profilePic: user.profilePic,
        },
      };
    } catch (error) {
      console.error('Google login error:', error);
      throw new BadRequestException('Error during Google login process');
    }
  }

  async googleOrganizerLogin(googleUser: any) {
    try {
      const { googleId, email, name, profilePic } = googleUser;
      
      // Check if organizer exists with this email
      let organizer = await this.prisma.organizer.findUnique({
        where: { email },
      });

      if (organizer) {
        // If organizer exists but doesn't have Google ID, update it
        if (!organizer.googleId) {
          organizer = await this.prisma.organizer.update({
            where: { email },
            data: {
              googleId,
              isGoogleAuth: true,
              isVerified: true, // Google accounts are automatically verified
              profilePic: profilePic || organizer.profilePic,
            },
          });
        }
      } else {
        // Create new organizer with Google OAuth
        organizer = await this.prisma.organizer.create({
          data: {
            email,
            name,
            googleId,
            profilePic,
            isGoogleAuth: true,
            isVerified: true, // Google accounts are automatically verified
          },
        });
      }

      const payload = { 
        sub: organizer.id, 
        email: organizer.email, 
        role: Role.ORGANIZER 
      };

      return {
        success: true,
        message: 'Google organizer login successful',
        data: {
          access_token: this.jwtService.sign(payload),
          name: organizer.name,
          email: organizer.email,
          role: Role.ORGANIZER,
          profilePic: organizer.profilePic,
        },
      };
    } catch (error) {
      console.error('Google organizer login error:', error);
      throw new BadRequestException('Error during Google organizer login process');
    }
  }

  async googleOAuth(googleOAuthDto: GoogleOAuthDto) {
    try {
      const { email, name, googleId, profilePic, role } = googleOAuthDto;

      if (role === Role.USER) {
        return this.googleLogin({ googleId, email, name, profilePic });
      } else if (role === Role.ORGANIZER) {
        return this.googleOrganizerLogin({ googleId, email, name, profilePic });
      } else {
        throw new BadRequestException('Invalid role for Google OAuth');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Google OAuth error:', error);
      throw new BadRequestException('Error during Google OAuth process');
    }
  }
}
