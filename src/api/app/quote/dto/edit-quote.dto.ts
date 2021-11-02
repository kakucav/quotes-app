import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../../../entity/category/category.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class EditQuoteDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  author: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  category: Category;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  authorPhoto: any;
}
