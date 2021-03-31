import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersDataService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './user.orm.entity';

@Module({
/*   imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [UsersDataService], */
  controllers: [UsersController],
})
export class UsersModule {}
