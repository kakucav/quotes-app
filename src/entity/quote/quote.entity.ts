import {
  AfterInsert,
  AfterLoad,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { User } from '../user/user.entity';
import { QuoteStatus } from '../../enum/quote-status.enum';
import { CommonEntity } from '../common/common.entity';

@Entity()
export class Quote extends CommonEntity {
  constructor(partial: Partial<Quote>) {
    super();
    Object.assign(this, partial);
  }

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  author: string;

  @Column({ default: null })
  authorPhoto: string;

  @ManyToOne(() => Category)
  category: Category;

  @Column({ type: 'tinyint', default: 0 })
  isDeleted: boolean;

  @ManyToOne(() => User)
  createdBy: User;

  @Column({ default: '' })
  slug: string;

  @Column({ default: QuoteStatus.APPROVED })
  status: QuoteStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    console.log('before');
  }

  @AfterInsert()
  afterInsert() {
    console.log('after');
  }

  @AfterLoad()
  afterLoad() {
    console.log('after load');
  }
}
