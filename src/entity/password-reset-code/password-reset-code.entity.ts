import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { CommonEntity } from '../common/common.entity';

@Entity()
export class PasswordResetCode extends CommonEntity {
  @Column()
  code: number;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
