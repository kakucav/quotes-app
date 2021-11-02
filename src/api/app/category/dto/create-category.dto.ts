import { IsNotEmpty } from 'class-validator';
import { Category } from '../../../../entity/category/category.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ default: '' })
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  parentId: Category;
}
