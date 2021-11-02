import { EntityRepository, Repository } from 'typeorm';
import { PasswordResetCode } from '../../entity/password-reset-code/password-reset-code.entity';
import { User } from '../../entity/user/user.entity';
import { ConflictException } from '@nestjs/common';

@EntityRepository(PasswordResetCode)
export class PasswordResetCodeRepository extends Repository<PasswordResetCode> {
  async createCode(user: User): Promise<number> {
    const code = Number(
      (Math.floor(Math.random() * 10000) + 10000).toString().substring(1),
    );
    await this.save({ code, user });
    return code;
  }

  async checkIfUserHaveActiveCode(user: User): Promise<void> {
    const code: PasswordResetCode = await this.findOne({ user });
    if (code && !this.checkIfCodeExpired(code.createdAt)) {
      throw new ConflictException(
        'You already received password reset code. 24h is required to pass before you can request new code.',
      );
    } else if (code) {
      await this.delete(code.id);
    }
  }

  async checkIfCodeExists(code: number): Promise<User> {
    const codeFromDb = await this.findOneOrFail(
      { code },
      { relations: ['user'] },
    );
    if (this.checkIfCodeExpired(codeFromDb.createdAt)) {
      throw new ConflictException('Your code expired. Please request new.');
    }
    return codeFromDb.user;
  }

  getTimestamp(date: Date): number {
    return Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds(),
    );
  }

  checkIfCodeExpired(createdAt: Date): boolean {
    const createdAtTimestamp = this.getTimestamp(createdAt);
    return (
      Date.now() - createdAtTimestamp >
      Number(process.env.PASSWORD_RESET_CODE_EXPIRATION)
    );
  }
}
