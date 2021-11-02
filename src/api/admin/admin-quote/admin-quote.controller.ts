import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminQuoteService } from './admin-quote.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Quote } from '../../../entity/quote/quote.entity';
import { FilterDto } from '../../../common/dto/filter.dto';
import { OrderDto } from '../../../common/dto/order.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AdminCreateQuoteDto } from './dto/admin-create-quote.dto';
import { AdminEditQuoteDto } from './dto/admin-edit-quote.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { AdminCreateMultipleQuotesDto } from './dto/admin-create-multiple-quotes.dto';
import { AdminEditMultipleQuotesDto } from './dto/admin-edit-multiple-quotes.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import getMulterConfig from '../../../config/multer.config';
import { MulterConfigEnum } from '../../../enum/multer-config.enum';
import { BaseController } from '../../../common/base.controller';

@ApiBearerAuth()
@ApiTags('Admin quote endpoints')
@Controller()
@UseGuards(JwtAuthGuard, RoleGuard)
export class AdminQuoteController extends BaseController {
  constructor(private readonly adminQuoteService: AdminQuoteService) {
    super();
  }

  @Get()
  async findAllQuotes(
    @Query() filterDto: FilterDto,
    @Query() orderDto: OrderDto,
    @Query() paginationDto: PaginationDto,
  ): Promise<{ data: Quote[]; pagination: { page: number; perPage: number } }> {
    const pagination = this.paginationService.setPagination(paginationDto);
    const filters = this.filterService.setFilters(filterDto);
    const order = this.orderService.setOrder(orderDto);

    const quotes = await this.adminQuoteService.findAllQuotes(
      filters,
      order,
      pagination,
    );

    return {
      data: quotes,
      pagination: {
        page: paginationDto.page || Number(process.env.DEFAULT_PAGE),
        perPage: pagination.take,
      },
    };
  }

  @Get('pending')
  async findPendingQuotes(): Promise<Quote[]> {
    return await this.adminQuoteService.findPendingQuotes();
  }

  @Get(':id')
  async findQuote(@Param('id') id: number): Promise<Quote> {
    return await this.adminQuoteService.findQuote(id);
  }

  @Get('user/:id')
  async findQuotesByUser(@Param('id') id: number): Promise<Quote[]> {
    return await this.adminQuoteService.findQuotesByUser(id);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AdminCreateQuoteDto })
  @UseInterceptors(
    FileInterceptor(
      'authorPhoto',
      getMulterConfig(
        process.env.QUOTE_AUTHOR_PHOTOS_DEST,
        MulterConfigEnum.QUOTE,
      ),
    ),
  )
  async createQuote(
    @UploadedFile() authorPhoto: Express.Multer.File,
    @Body() adminCreateQuoteDto: AdminCreateQuoteDto,
  ): Promise<Quote> {
    return await this.adminQuoteService.createQuote(
      adminCreateQuoteDto,
      authorPhoto,
    );
  }

  @Post('multiple')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AdminCreateMultipleQuotesDto })
  @UseInterceptors(
    FilesInterceptor(
      'photos',
      Number(process.env.MAX_NUM_OF_QUOTE_PHOTO_FILES),
      getMulterConfig(
        process.env.QUOTE_AUTHOR_PHOTOS_DEST,
        MulterConfigEnum.QUOTE,
      ),
    ),
  )
  async createMultipleQuotes(
    @UploadedFiles() photos: Express.Multer.File[],
    @Body() adminCreateMultipleQuotesDto: AdminCreateMultipleQuotesDto,
  ): Promise<Quote[]> {
    return await this.adminQuoteService.createMultipleQuotes(
      adminCreateMultipleQuotesDto,
      photos,
    );
  }

  @Put('multiple')
  async editMultipleQuotes(
    @Body() adminEditMultipleQuotesDto: AdminEditMultipleQuotesDto,
  ): Promise<void> {
    return await this.adminQuoteService.editMultipleQuotes(
      adminEditMultipleQuotesDto,
    );
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AdminEditQuoteDto })
  @UseInterceptors(
    FileInterceptor(
      'authorPhoto',
      getMulterConfig(
        process.env.QUOTE_AUTHOR_PHOTOS_DEST,
        MulterConfigEnum.QUOTE,
      ),
    ),
  )
  async editQuote(
    @Param('id') id: number,
    @UploadedFile() authorPhoto: Express.Multer.File,
    @Body() adminEditQuoteDto: AdminEditQuoteDto,
  ): Promise<Quote | DeleteResult> {
    return await this.adminQuoteService.editQuote(
      id,
      authorPhoto,
      adminEditQuoteDto,
    );
  }

  @Delete('multiple')
  async disableMultipleQuotes(@Body() ids: number[]): Promise<void> {
    return await this.adminQuoteService.disableMultipleQuotes(ids);
  }

  @Delete(':id')
  async disableQuote(
    @Param('id') id: number,
  ): Promise<DeleteResult | UpdateResult> {
    return await this.adminQuoteService.disableQuote(id);
  }
}
