import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginCredentialsDto {
  @ApiProperty()
  @IsNotEmpty()
  usernameOrEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
