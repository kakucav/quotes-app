import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UserRole } from '../../enum/user-role.enum';
import { Exclude } from 'class-transformer';
import { Quote } from '../quote/quote.entity';
import { UserPhoto } from '../user-photo/user-photo.entity';
import { CommonEntity } from '../common/common.entity';

@Entity()
export class User extends CommonEntity {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, default: null })
  email: string;

  @Exclude()
  @Column({ default: null })
  password: string;

  @Exclude()
  @Column({ default: null })
  salt: string;

  @Column({ default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Quote, (quote) => quote.createdBy)
  quotes: Quote[];

  @OneToOne(() => UserPhoto)
  @JoinColumn()
  profilePhoto: UserPhoto;

  @Column({ default: 0 })
  passwordChangeCounter: number;

  @Column({ default: true })
  isEnabled: boolean;

  @Column({ nullable: true })
  oAuthAccessToken: string;
}
