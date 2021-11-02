import { Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  setOrder({ orderBy = 'createdAt', orderType = 'DESC' }: OrderDto) {
    return {
      orderBy,
      orderType,
    };
  }
}
