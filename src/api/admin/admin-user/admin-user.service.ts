import { Injectable } from '@nestjs/common';
import { User } from '../../../entity/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../../repository/user/user.repository';
import { UpdateResult } from 'typeorm';
import { ExceptionService } from '../../../common/exception.service';
import { AdminEditUserDto } from './dto/admin-edit-user.dto';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(User) private userRepository: UserRepository,
    private exceptionService: ExceptionService,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUser(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail(id);
    } catch (error) {
      this.exceptionService.throwException(error);
    }
  }

  async editUser(
    id: number,
    adminEditUserDto: AdminEditUserDto,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(id, {
      ...adminEditUserDto,
    });
  }
}
