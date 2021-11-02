import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AdminEditMultipleQuotesDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  ids: number[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  createdBy: number;
}
