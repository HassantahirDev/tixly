import { Controller, Post, Body, UseGuards, Get, Req, Res, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendOtpDto } from './dto/send-otp.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { GoogleOAuthDto } from './dto/google-oauth.dto';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { Request, Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'Verification code sent successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify email with OTP' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 401, description: 'Invalid verification code' })
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('me')
  @ApiOperation({ summary: 'Check validity of token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  checkValidityOfToken(@Body() token: string) {
    return this.authService.checkValidityOfToken(token);
  }

  @Post('update-password')
  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(updatePasswordDto);
  }

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to email' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendVerificationCode(sendOtpDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirect to Google OAuth' })
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() req: Request, @Query('role') role: string = 'USER') {
    // Guard redirects to Google OAuth
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Google login successful' })
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response, @Query('role') role: string = 'USER') {
    try {
      // The user data is available in req.user from the Google strategy
      const googleUser = req.user as any;
      
      let result;
      if (role === 'ORGANIZER') {
        result = await this.authService.googleOrganizerLogin(googleUser);
      } else {
        result = await this.authService.googleLogin(googleUser);
      }

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/callback?token=${result.data.access_token}&role=${result.data.role}`;
      
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google auth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/error?message=Google authentication failed`);
    }
  }

  @Post('google')
  @ApiOperation({ summary: 'Google OAuth login via POST' })
  @ApiResponse({ status: 200, description: 'Google login successful' })
  @ApiResponse({ status: 400, description: 'Invalid Google OAuth data' })
  googleOAuth(@Body() googleOAuthDto: GoogleOAuthDto) {
    return this.authService.googleOAuth(googleOAuthDto);
  }
}