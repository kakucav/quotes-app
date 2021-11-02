import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slug } from '../../entity/slug/slug.entity';
import { SlugRepository } from '../../repository/slug.repository';
import { UpdateResult } from 'typeorm';

@Injectable()
export class SlugService {
  constructor(
    @InjectRepository(Slug)
    private slugRepository: SlugRepository,
  ) {}

  async getExistingSlug(slug: string): Promise<Slug> {
    return await this.slugRepository.findOne({ slug });
  }

  async createSlug(slug: string): Promise<Slug> {
    const newSlug: Slug = new Slug();
    newSlug.slug = slug;

    return await this.slugRepository.save(newSlug);
  }

  async updateSlugCount(id: number, slug: Slug): Promise<UpdateResult> {
    return await this.slugRepository.update(id, slug);
  }
}
