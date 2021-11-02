import { Injectable } from '@nestjs/common';
import { Quote } from '../../../entity/quote/quote.entity';
import { QuoteRepository } from '../../../repository/quote/quote.repository';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { EditQuoteDto } from './dto/edit-quote.dto';
import { HelperService } from '../../../common/helper.service';
import { User } from '../../../entity/user/user.entity';
import { ExceptionService } from '../../../common/exception.service';
import { QuoteStatus } from '../../../enum/quote-status.enum';

@Injectable()
export class QuoteService {
  constructor(
    private quoteRepository: QuoteRepository,
    private helperService: HelperService,
    private exceptionService: ExceptionService,
  ) {}

  async createQuote(
    createQuoteDto: CreateQuoteDto,
    authorPhoto: Express.Multer.File,
    user: User,
  ): Promise<Quote> {
    const quote: Quote = new Quote(createQuoteDto);
    quote.slug = await this.helperService.generateSlug(quote.title);
    quote.authorPhoto = this.helperService.getPhotoDestination(authorPhoto);

    await this.helperService.resizeQuotePhoto(
      quote.authorPhoto,
      Number(process.env.QUOTE_IMAGE_SIZE_1),
    );
    await this.helperService.resizeQuotePhoto(
      quote.authorPhoto,
      Number(process.env.QUOTE_IMAGE_SIZE_2),
    );
    return await this.quoteRepository.save({
      ...quote,
      createdBy: user,
      status: QuoteStatus.PENDING,
    });
  }

  async findAllQuotes(
    filters,
    order,
    pagination,
    user: User,
  ): Promise<Quote[]> {
    return await this.quoteRepository.findQuotesForUser(
      filters,
      order,
      pagination,
      user,
    );
  }

  findOneQuote(id: number, user: User): Promise<Quote> {
    return this.checkIfQuoteBelongsToUser(id, user);
  }

  async editQuote(
    id: number,
    editQuoteDto: EditQuoteDto,
    authorPhoto: Express.Multer.File,
    user: User,
  ): Promise<Quote> {
    const oldQuote = await this.checkIfQuoteBelongsToUser(id, user);
    const quote = await this.helperService.generateQuoteObject(
      editQuoteDto,
      authorPhoto,
      oldQuote,
    );
    await this.quoteRepository.update(id, quote);
    return quote;
  }

  async disableQuote(
    id: number,
    user: User,
  ): Promise<DeleteResult | UpdateResult> {
    const quote = await this.checkIfQuoteBelongsToUser(id, user);
    if (quote.isDeleted) {
      if (quote.authorPhoto)
        await this.helperService.deletePhotosFolder(quote.authorPhoto);
      return await this.quoteRepository.delete(id);
    } else {
      return await this.quoteRepository.update(id, {
        isDeleted: true,
      });
    }
  }

  checkIfQuoteBelongsToUser(quoteId: number, user: User): Promise<Quote> {
    try {
      return this.quoteRepository.findOneOrFail({
        where: { id: quoteId, createdBy: user, status: QuoteStatus.APPROVED },
      });
    } catch (error) {
      this.exceptionService.throwException(error);
    }
  }
}
