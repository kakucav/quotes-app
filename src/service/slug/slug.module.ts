import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slug } from '../../entity/slug/slug.entity';
import { SlugService } from './slug.service';
import { ExceptionService } from '../../common/exception.service';

@Module({
  imports: [TypeOrmModule.forFeature([Slug])],
  providers: [SlugService, ExceptionService],
  exports: [SlugService],
})
export class SlugModule {}
