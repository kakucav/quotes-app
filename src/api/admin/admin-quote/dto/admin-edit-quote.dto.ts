import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../../../entity/category/category.entity';
import { User } from '../../../../entity/user/user.entity';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { QuoteStatus } from '../../../../enum/quote-status.enum';

export class AdminEditQuoteDto {
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

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  createdBy: User;

  @ApiProperty()
  @IsEnum(QuoteStatus)
  @IsOptional()
  status: QuoteStatus;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  authorPhoto: any;
}
