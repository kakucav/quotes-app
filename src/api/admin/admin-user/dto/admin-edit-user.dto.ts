import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../../../enum/user-role.enum';

export class AdminEditUserDto {
  @ApiProperty()
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isEnabled: boolean;
}
