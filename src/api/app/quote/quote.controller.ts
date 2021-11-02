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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { Quote } from '../../../entity/quote/quote.entity';
import { DeleteResult } from 'typeorm';
import { EditQuoteDto } from './dto/edit-quote.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { FilterDto } from '../../../common/dto/filter.dto';
import { OrderDto } from '../../../common/dto/order.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../../entity/user/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import getMulterConfig from '../../../config/multer.config';
import { MulterConfigEnum } from '../../../enum/multer-config.enum';
import { QuoteRepository } from '../../../repository/quote/quote.repository';
import { BaseController } from '../../../common/base.controller';

@Controller()
@ApiTags('Quote endpoints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class QuoteController extends BaseController {
  constructor(
    private readonly quoteService: QuoteService,
    private readonly quoteRepository: QuoteRepository,
  ) {
    super();
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateQuoteDto })
  @UseInterceptors(
    FileInterceptor(
      'authorPhoto',
      getMulterConfig(
        process.env.QUOTE_AUTHOR_PHOTOS_DEST,
        MulterConfigEnum.QUOTE,
      ),
    ),
  )
  createQuote(
    @UploadedFile() authorPhoto: Express.Multer.File,
    @Body() createQuoteDto: CreateQuoteDto,
    @GetUser() user: User,
  ): Promise<Quote> {
    return this.quoteService.createQuote(createQuoteDto, authorPhoto, user);
  }

  @Get()
  async findAllQuotes(
    @Query() filterDto: FilterDto,
    @Query() orderDto: OrderDto,
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User,
  ): Promise<{ data: Quote[]; pagination: { page: number; perPage: number } }> {
    const filters = this.filterService.setFilters(filterDto);
    const order = this.orderService.setOrder(orderDto);
    const pagination = this.paginationService.setPagination(paginationDto);

    const quotes = await this.quoteService.findAllQuotes(
      filters,
      order,
      pagination,
      user,
    );

    return {
      data: quotes,
      pagination: {
        page: paginationDto.page || Number(process.env.DEFAULT_PAGE),
        perPage: pagination.take,
      },
    };
  }

  @Get(':id')
  findOneQuote(@Param('id') id: number, @GetUser() user: User): Promise<Quote> {
    return this.quoteService.findOneQuote(id, user);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: EditQuoteDto })
  @UseInterceptors(
    FileInterceptor(
      'authorPhoto',
      getMulterConfig(
        process.env.QUOTE_AUTHOR_PHOTOS_DEST,
        MulterConfigEnum.QUOTE,
      ),
    ),
  )
  editQuote(
    @Param('id') id: number,
    @UploadedFile() authorPhoto: Express.Multer.File,
    @Body() editQuoteDto: EditQuoteDto,
    @GetUser() user: User,
  ): Promise<Quote> {
    return this.quoteService.editQuote(id, editQuoteDto, authorPhoto, user);
  }

  @Delete(':id')
  disableQuote(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<DeleteResult | Quote> {
    return this.quoteService.disableQuote(id, user);
  }

  @Get('qb-test')
  async qbTest(@Param('id') id: number) {
    console.log(id);
    return await this.quoteRepository.qbTest(id);
  }
}
