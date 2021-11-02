import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EditUserDto {
  @ApiProperty({ default: '' })
  @IsNotEmpty()
  password: string;
}
