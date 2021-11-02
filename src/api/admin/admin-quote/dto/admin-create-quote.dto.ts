import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Category } from '../../../../entity/category/category.entity';
import { User } from '../../../../entity/user/user.entity';

export class AdminCreateQuoteDto {
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

  @ApiProperty()
  @IsOptional()
  createdBy: User;
}
