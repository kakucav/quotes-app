import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entity/user/user.entity';
import { HelperService } from '../../common/helper.service';
import { SlugService } from '../../service/slug/slug.service';
import { Slug } from '../../entity/slug/slug.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from '../app/user/user.module';
import { MailModule } from '../../service/mail/mail.module';
import { PasswordResetCodeRepository } from '../../repository/password-reset-code/password-reset-code.repository';
import { ExceptionService } from '../../common/exception.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { GithubStrategy } from './strategy/github.strategy';
import { FacebookStrategy } from './strategy/facebook.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRE),
      },
    }),
    TypeOrmModule.forFeature([User, Slug, PasswordResetCodeRepository]),
    UserModule,
    MailModule,
  ],
  providers: [
    AuthService,
    HelperService,
    SlugService,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    FacebookStrategy,
    ExceptionService,
  ],
  controllers: [AuthController],
  exports: [
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    FacebookStrategy,
    PassportModule,
  ],
})
export class AuthModule {}
