import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { CommonEntity } from '../common/common.entity';

@Entity()
@Unique(['title'])
export class Category extends CommonEntity {
  constructor(partial: Partial<Category>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'varchar', length: 40 })
  title: string;

  @ManyToOne(() => Category)
  parent: Category;
}
