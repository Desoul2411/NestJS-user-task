import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';


@Entity()
export class User {
  @ApiProperty() // for Swagger
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  userNameHashed: string;

  @ApiProperty()
  @Column()
  userPasswordEncrypted: string;

  @ApiProperty()
  @Column()
  group: number;
}
