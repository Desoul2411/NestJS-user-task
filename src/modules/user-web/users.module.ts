import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
/* import { UsersDataService } from './users.service'; */
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../user-persistence/user.orm.entity';
import { UserPersistenceAdapterService } from '../user-persistence/user.persistance-adapter.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [UserPersistenceAdapterService],
})
export class UsersModule {}
