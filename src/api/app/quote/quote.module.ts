import { Module } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperService } from '../../../common/helper.service';
import { PaginationService } from '../../../common/pagination.service';
import { FilterService } from '../../../common/filter.service';
import { OrderService } from '../../../common/order.service';
import { AuthModule } from '../../auth/auth.module';
import { SlugModule } from '../../../service/slug/slug.module';
import { QuoteRepository } from '../../../repository/quote/quote.repository';
import { ExceptionService } from '../../../common/exception.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuoteRepository]),
    SlugModule,
    AuthModule,
  ],
  providers: [
    QuoteService,
    HelperService,
    FilterService,
    OrderService,
    PaginationService,
    ExceptionService,
  ],
  controllers: [QuoteController],
})
export class QuoteModule {}
