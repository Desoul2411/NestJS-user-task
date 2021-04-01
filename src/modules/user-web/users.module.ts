import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
/* import { UsersDataService } from './users.service'; */
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../user-persistence/user.orm.entity';

@Module({
  controllers: [UsersController],
})
export class UsersModule {}
