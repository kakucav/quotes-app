import { EntityRepository, Repository } from 'typeorm';
import { Slug } from '../entity/slug/slug.entity';

@EntityRepository(Slug)
export class SlugRepository extends Repository<Slug> {}
