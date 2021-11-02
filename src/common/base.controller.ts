import { OrderService } from './order.service';
import { PaginationService } from './pagination.service';
import { FilterService } from './filter.service';

export class BaseController {
  protected orderService: OrderService;
  protected paginationService: PaginationService;
  protected filterService: FilterService;

  constructor() {
    this.orderService = new OrderService();
    this.paginationService = new PaginationService();
    this.filterService = new FilterService();
  }
}
