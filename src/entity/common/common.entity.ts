import { BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
