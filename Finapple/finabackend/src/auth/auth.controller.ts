import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Response } from 'express';

export interface registerBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('/register')
  register(@Body() body: registerBody) {
    return this.authservice.register(body);
  }

  @Post('/login')
  async login(
    @Body() body: LoginBody,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authservice.login(body);
    res.cookie('access_token', data.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });
    return {
      token: data.token,
      message: data.message,
      user: data.user,
    };
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return { message: 'Logged out successfully' };
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req: any) {
    return this.authservice.getMe(req.user.id);
  }

  @Post('/profile')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(@Req() req: any, @Body() body: { fullName: string }) {
    return this.authservice.updateProfile(req.user.id, body.fullName);
  }

  @Post('/change-password')
  @UseGuards(AuthGuard('jwt'))
  changePassword(
    @Req() req: any,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.authservice.changePassword(
      req.user.id,
      body.currentPassword,
      body.newPassword,
    );
  }
}
