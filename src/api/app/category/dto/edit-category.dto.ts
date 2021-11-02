import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../../../entity/category/category.entity';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class EditCategoryDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @Type(() => Category)
  parent: Category;
}
