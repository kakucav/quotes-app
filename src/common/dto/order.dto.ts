import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty({ required: false })
  orderBy: string;

  @ApiProperty({ required: false })
  orderType: string;
}
