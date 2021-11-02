import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '../../../entity/user/user.entity';
import { UserRole } from '../../../enum/user-role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    return user.role === UserRole.ADMIN;
  }
}
