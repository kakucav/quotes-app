import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../../entity/user/user.entity';
import { EditUserDto } from './dto/edit-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { GetUser } from '../../auth/get-user.decorator';
import { UpdateResult } from 'typeorm';
import { FilesInterceptor } from '@nestjs/platform-express';
import getMulterConfig from '../../../config/multer.config';
import { SetProfilePhotoDto } from './dto/set-profile-photo.dto';
import { FilesUploadDto } from './dto/files-upload.dto';
import { MulterConfigEnum } from '../../../enum/multer-config.enum';

@Controller()
@ApiTags('User endpoints')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Put('me')
  editUser(
    @Body() editUserDto: EditUserDto,
    @GetUser() user: User,
  ): Promise<UpdateResult> {
    return this.userService.editUser(editUserDto, user);
  }

  @Post('photos')
  @UseInterceptors(
    FilesInterceptor(
      'photos',
      Number(process.env.MAX_NUM_OF_USER_PHOTO_FILES),
      getMulterConfig(process.env.USER_PHOTOS_DEST, MulterConfigEnum.USER),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FilesUploadDto })
  async uploadPhotos(
    @UploadedFiles() photos: Array<Express.Multer.File>,
    @GetUser() user: User,
  ): Promise<void> {
    return await this.userService.uploadPhotos(photos, user);
  }

  @Post('profile-photo')
  async setProfilePhoto(
    @Body() setProfilePhotoDto: SetProfilePhotoDto,
    @GetUser() user: User,
  ): Promise<void> {
    return await this.userService.setProfilePhoto(setProfilePhotoDto, user);
  }

  @Get('photos/:id')
  async getPhotoLink(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<{ photo: string }> {
    return await this.userService.getPhotoLink(id, user);
  }
}
