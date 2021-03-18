import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userNameHashed: string;

  @Column()
  userPasswordEncrypted: string;

  @Column()
  group: number;
}
