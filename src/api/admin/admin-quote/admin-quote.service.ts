import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from '../../../entity/quote/quote.entity';
import { QuoteRepository } from '../../../repository/quote/quote.repository';
import { User } from '../../../entity/user/user.entity';
import { UserRepository } from '../../../repository/user/user.repository';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AdminCreateQuoteDto } from './dto/admin-create-quote.dto';
import { HelperService } from '../../../common/helper.service';
import { UserRole } from '../../../enum/user-role.enum';
import { AdminEditQuoteDto } from './dto/admin-edit-quote.dto';
import { AdminCreateMultipleQuotesDto } from './dto/admin-create-multiple-quotes.dto';
import { AdminEditMultipleQuotesDto } from './dto/admin-edit-multiple-quotes.dto';
import { ExceptionService } from '../../../common/exception.service';
import { QuoteStatus } from '../../../enum/quote-status.enum';

@Injectable()
export class AdminQuoteService {
  constructor(
    @InjectRepository(Quote)
    private quoteRepository: QuoteRepository,
    @InjectRepository(User)
    private userRepository: UserRepository,
    private helperService: HelperService,
    private exceptionService: ExceptionService,
  ) {}

  async findAllQuotes(filters, order, pagination): Promise<Quote[]> {
    return await this.quoteRepository.find({
      where: {
        ...filters,
      },
      order: {
        [order.orderBy]: order.orderType,
      },
      ...pagination,
    });
  }

  async findQuote(id: number): Promise<Quote> {
    try {
      return await this.quoteRepository.findOneOrFail(id, {
        relations: ['createdBy'],
      });
    } catch (error) {
      this.exceptionService.throwException(error);
    }
  }

  async findPendingQuotes(): Promise<Quote[]> {
    return await this.quoteRepository.find({
      where: { status: QuoteStatus.PENDING },
    });
  }

  async findQuotesByUser(userId: number): Promise<Quote[]> {
    try {
      const user: User = await this.userRepository.findOneOrFail(userId, {
        relations: ['quotes'],
      });
      return user.quotes;
    } catch (error) {
      this.exceptionService.throwException(error);
    }
  }

  async createQuote(
    adminCreateQuoteDto: AdminCreateQuoteDto,
    authorPhoto: Express.Multer.File,
  ): Promise<Quote> {
    if (adminCreateQuoteDto.createdBy) {
      await this.checkIfUserExistsAndIsAdmin(adminCreateQuoteDto.createdBy);
    }

    const quote: Quote = new Quote(adminCreateQuoteDto);
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

    return await this.quoteRepository.save(quote);
  }

  async createMultipleQuotes(
    adminCreateMultipleQuotesDto: AdminCreateMultipleQuotesDto,
    photos: Express.Multer.File[],
  ): Promise<Quote[]> {
    const quotes: Quote[] = JSON.parse(
      adminCreateMultipleQuotesDto.quotes.toString(),
    );

    for (const quote of quotes) {
      await this.checkIfUserExistsAndIsAdmin(quote.createdBy);
    }
    for (const quote of quotes) {
      quote.slug = await this.helperService.generateSlug(quote.title);

      const matchingPhoto = photos.find(
        (p) => p.originalname === quote.authorPhoto,
      );

      if (matchingPhoto) {
        quote.authorPhoto =
          this.helperService.getPhotoDestination(matchingPhoto);
      } else {
        delete quote.authorPhoto;
      }
    }

    return await this.quoteRepository.save(quotes);
  }

  async editMultipleQuotes(
    adminEditMultipleQuotesDto: AdminEditMultipleQuotesDto,
  ): Promise<void> {
    for (const id of adminEditMultipleQuotesDto.ids) {
      const quote: Quote = await this.findQuote(id);
      quote.createdBy.id = adminEditMultipleQuotesDto.createdBy;
      await this.quoteRepository.update(id, quote);
    }
  }

  async editQuote(
    id: number,
    authorPhoto: Express.Multer.File,
    adminEditQuoteDto: AdminEditQuoteDto,
  ): Promise<Quote | DeleteResult> {
    if (adminEditQuoteDto.createdBy) {
      await this.checkIfUserExistsAndIsAdmin(adminEditQuoteDto.createdBy);
    }

    if (adminEditQuoteDto.status === QuoteStatus.REJECTED) {
      return await this.quoteRepository.delete(id);
    }

    const oldQuote = await this.quoteRepository.findOneOrFail(id);
    const quote = await this.helperService.generateQuoteObject(
      adminEditQuoteDto,
      authorPhoto,
      oldQuote,
    );
    await this.quoteRepository.update(id, quote);
    return quote;
  }

  async disableQuote(id: number): Promise<DeleteResult | UpdateResult> {
    try {
      const quote = await this.quoteRepository.findOneOrFail(id);
      if (quote.isDeleted) {
        if (quote.authorPhoto)
          await this.helperService.deletePhotosFolder(quote.authorPhoto);
        return await this.quoteRepository.delete(id);
      } else {
        quote.isDeleted = true;
        return await this.quoteRepository.update(id, quote);
      }
    } catch (error) {
      this.exceptionService.throwException(error);
    }
  }

  async disableMultipleQuotes(ids: number[]): Promise<void> {
    for (const id of ids) {
      await this.disableQuote(id);
    }
  }

  async checkIfUserExistsAndIsAdmin(user: User): Promise<void> {
    const userCheck: User = await this.userRepository.findOne(user);
    if (!userCheck) {
      throw new NotFoundException();
    } else if (userCheck.role === UserRole.ADMIN) {
      throw new BadRequestException(`Admins can't have posts`);
    }
  }
}
