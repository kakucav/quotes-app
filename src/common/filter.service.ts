import { Injectable } from '@nestjs/common';
import { FilterDto } from './dto/filter.dto';
import { QuoteStatus } from '../enum/quote-status.enum';

@Injectable()
export class FilterService {
  setFilters(filterDto: FilterDto) {
    const filters = {
      status: QuoteStatus.APPROVED,
    };

    if (!filterDto.isDeleted) {
      filterDto.isDeleted = '0';
    }

    filters['isDeleted'] = filterDto.isDeleted === '1';
    delete filterDto.isDeleted;

    for (const filter in filterDto) {
      if (filterDto[filter]) {
        filters[filter] = filterDto[filter];
      }
    }

    return filters;
  }
}
