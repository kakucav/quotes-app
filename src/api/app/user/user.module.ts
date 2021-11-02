import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../entity/user/user.entity';
import { HelperService } from '../../../common/helper.service';
import { SlugModule } from '../../../service/slug/slug.module';
import { UserPhoto } from '../../../entity/user-photo/user-photo.entity';
import { ExceptionService } from '../../../common/exception.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPhoto]), SlugModule],
  controllers: [UserController],
  providers: [UserService, HelperService, ExceptionService],
  exports: [UserService],
})
export class UserModule {}
