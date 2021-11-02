import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../common/common.entity';

@Entity()
export class Slug extends CommonEntity {
  @Column()
  slug: string;

  @Column({ type: 'int', unsigned: true, default: 1 })
  count: number;
}
