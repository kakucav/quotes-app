import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../app/user/dto/create-user.dto';
import { User } from '../../entity/user/user.entity';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { Request } from 'express';
import { GithubAuthGuard } from './guards/github.guard';
import { FacebookAuthGuard } from './guards/facebook.guard';

@Controller()
@ApiTags('Auth endpoints')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @ApiOAuth2([])
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req: Request,
  ): Promise<{ user: User; token: string }> {
    return await this.authService.oAuthLogin(req);
  }

  @Get('github')
  @ApiOAuth2([])
  @UseGuards(GithubAuthGuard)
  async githubAuth() {}

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubAuthRedirect(
    @Req() req: Request,
  ): Promise<{ user: User; token: string }> {
    return await this.authService.oAuthLogin(req);
  }

  @Get('facebook')
  @ApiOAuth2([])
  @UseGuards(FacebookAuthGuard)
  async facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthRedirect(
    @Req() req: Request,
  ): Promise<{ user: User; token: string }> {
    return await this.authService.oAuthLogin(req);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginCredentialsDto: LoginCredentialsDto): Promise<{
    user: User;
    token: string;
  }> {
    return await this.authService.login(loginCredentialsDto);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return await this.authService.changePassword(changePasswordDto);
  }
}
