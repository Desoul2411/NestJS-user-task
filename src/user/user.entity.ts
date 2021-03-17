import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  userName: string;

  @Column()
  userOldPassword: string;

  @Column()
  userNewPassword: string;

  @Column()
  signature: string;
}
