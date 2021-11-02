import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SetProfilePhotoDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}
