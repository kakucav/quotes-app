import { IsBooleanString, IsNumberString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  @IsBooleanString()
  isDeleted: string;

  @ApiProperty({ required: false })
  @IsOptional()
  author: string;

  @ApiProperty({ required: false })
  @IsOptional()
  title: string;
}
