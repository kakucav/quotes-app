import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class PaginationService {
  setPagination(paginationDto: PaginationDto): { skip: number; take: number } {
    let page = Number(paginationDto.page || process.env.DEFAULT_PAGE);
    if (page === 0) {
      page = Number(process.env.DEFAULT_PER_PAGE);
    }

    const limit = Number(paginationDto.limit || process.env.DEFAULT_PER_PAGE);

    return {
      skip: (page - 1) * limit,
      take: limit,
    };
  }
}
