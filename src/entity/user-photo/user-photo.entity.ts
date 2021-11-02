import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { CommonEntity } from '../common/common.entity';

@Entity()
export class UserPhoto extends CommonEntity {
  constructor(partial: Partial<UserPhoto>) {
    super();
    Object.assign(this, partial);
  }

  @Column()
  photo: string;

  @ManyToOne(() => User)
  user: User;
}
