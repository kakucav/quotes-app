import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '../../../entity/category/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { EditCategoryDto } from './dto/edit-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@Controller()
@ApiTags('Category endpoints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  findAllCategories(): Promise<Category[]> {
    return this.categoryService.findAllCategories();
  }

  @Get(':id')
  findOneCategory(@Param('id') id: number): Promise<Category> {
    return this.categoryService.findOneCategory(id);
  }

  @Put(':id')
  editCategory(
    @Param('id') id: number,
    @Body() editCategoryDto: EditCategoryDto,
  ): Promise<UpdateResult> {
    return this.categoryService.editCategory(id, editCategoryDto);
  }

  @Delete(':id')
  deleteCategory(@Param('id') id: number): Promise<DeleteResult> {
    return this.categoryService.deleteCategory(id);
  }
}
