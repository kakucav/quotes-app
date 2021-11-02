import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Category } from '../../../../entity/category/category.entity';

export class CreateQuoteDto {
  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  authorPhoto: any;

  @ApiProperty()
  @IsNotEmpty()
  category: Category;
}
