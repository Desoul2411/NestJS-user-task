import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersDataService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.orm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersDataService],
  controllers: [UsersController],
})
export class UsersModule {}
