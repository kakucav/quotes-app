import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../app/user/user.service';
import { CreateUserDto } from '../app/user/dto/create-user.dto';
import { User } from '../../entity/user/user.entity';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../service/mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../repository/user/user.repository';
import { PasswordResetCodeRepository } from '../../repository/password-reset-code/password-reset-code.repository';
import { ChangePasswordDto } from './dto/change-password.dto';
import { HelperService } from '../../common/helper.service';
import { ExceptionService } from '../../common/exception.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
    private passwordResetCodeRepository: PasswordResetCodeRepository,
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private helperService: HelperService,
    private exceptionService: ExceptionService,
  ) {}

  async oAuthLogin(req): Promise<{ user: User; token: string }> {
    try {
      const user = await this.userService.findByUsernameOrCreate(req.user);
      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);
      return { user, token };
    } catch (error) {
      this.exceptionService.throwException(error);
    }
  }

  async fbLogin(req) {
    if (!req.user) return 'no user found';
    return req.user;
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const user: User = await this.userService.createUser(createUserDto);
    await this.mailService.sendWelcomeMail(user.username, user.email);
    return user;
  }

  async login(loginCredentialsDto: LoginCredentialsDto): Promise<{
    user: User;
    token: string;
  }> {
    const { usernameOrEmail, password } = loginCredentialsDto;
    const user = await this.userService.findUserByUsernameOrEmail(
      usernameOrEmail,
    );

    await this.checkPassword(password, user);

    const payload = { username: user.username };
    const token: string = this.jwtService.sign(payload);

    return { user, token };
  }

  async resetPassword({ email }: ResetPasswordDto): Promise<void> {
    try {
      const user: User = await this.userRepository.findOneOrFail({ email });
      await this.passwordResetCodeRepository.checkIfUserHaveActiveCode(user);
      const code: number = await this.passwordResetCodeRepository.createCode(
        user,
      );
      await this.mailService.sendPasswordResetMail(
        user.username,
        user.email,
        code,
      );
    } catch (error) {
      this.exceptionService.throwException(error);
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<void> {
    const { code, password } = changePasswordDto;
    let user: User;
    try {
      user = await this.passwordResetCodeRepository.checkIfCodeExists(code);
      const { hash, salt } = await this.helperService.hashPassword(password);
      await this.userRepository.update(user.id, {
        password: hash,
        salt,
        passwordChangeCounter: user.passwordChangeCounter + 1,
      });
      await this.passwordResetCodeRepository.delete({ user });
    } catch (error) {
      this.exceptionService.throwException(error);
    }
  }

  async checkPassword(password: string, user: User): Promise<void> {
    const passwordHash = await bcrypt.hash(password, user.salt);
    if (passwordHash !== user.password) {
      throw new UnauthorizedException();
    }
  }
}
