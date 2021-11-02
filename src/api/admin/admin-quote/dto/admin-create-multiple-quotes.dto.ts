import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { AdminCreateQuoteDto } from './admin-create-quote.dto';

export class AdminCreateMultipleQuotesDto {
  @ApiProperty()
  @IsOptional()
  quotes: AdminCreateQuoteDto;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  photos: any[];
}
