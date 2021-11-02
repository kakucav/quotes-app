import { Brackets, EntityRepository, Repository } from 'typeorm';
import { Quote } from '../../entity/quote/quote.entity';
import { User } from '../../entity/user/user.entity';
import { ExceptionService } from '../../common/exception.service';

@EntityRepository(Quote)
export class QuoteRepository extends Repository<Quote> {
  constructor(private exceptionService: ExceptionService) {
    super();
  }

  async findQuotesForUser(
    filters,
    order,
    pagination,
    user: User,
  ): Promise<Quote[]> {
    let qb = await this.createQueryBuilder('quote')
      .leftJoinAndSelect('quote.createdBy', 'user')
      .orderBy(`quote.${order.orderBy}`, order.orderType)
      .where('quote.isDeleted = :isDeleted', { isDeleted: filters.isDeleted });

    delete filters.isDeleted;

    for (const filter in filters) {
      qb = qb.andWhere(`quote.${filter} = :${filter}`, {
        [filter]: filters[filter],
      });
    }

    qb = qb.andWhere(
      new Brackets((qb1) => {
        qb1
          .where('quote.createdBy = :id', { id: user.id })
          .orWhere('quote.createdBy IS NULL');
      }),
    );

    return qb.skip(pagination.skip).take(pagination.take).getMany();
  }

  async qbTest(quoteId: number) {
    try {
      console.log(quoteId);
      // return await this.createQueryBuilder('quote')
      //   .select()
      //   .where('quote.id = :quoteId', { quoteId })
      //   .getOne();
    } catch (error) {
      this.exceptionService.throwException(error);
    }
  }
}
