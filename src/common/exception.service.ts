import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ExceptionService {
  throwException(error: any) {
    if (error.toString().includes('EntityNotFoundError')) {
      throw new NotFoundException('Resource not found!');
    }
    switch (error.code) {
      case 'ER_DUP_ENTRY':
        throw new ConflictException(error.message);
      case 'WARN_DATA_TRUNCATED':
        throw new ConflictException(error.message);
      case 'ER_NO_REFERENCED_ROW_2':
        throw new NotFoundException(error.message);
      default:
        throw new BadRequestException(error.message);
    }
  }
}
