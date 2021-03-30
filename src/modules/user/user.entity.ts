import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: 'User id' }) // for Swagger
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '9c2d29850e7fd884c19b3ef48a01b82c0a88854082ad150056ac770dcbeee05c',
    description: 'Hashed user name',
  })
  @Column()
  userNameHashed: string;

  @ApiProperty({
    example: 'm5biIADc/0jKc2oq8YXJOmRs9Dmw+71KPy+ghSDdoFY=',
    description: 'User password encrypted',
  })
  @Column()
  userPasswordEncrypted: string;

  @ApiProperty({ example: '2', description: 'user group number' })
  @Column()
  group: number;
}
