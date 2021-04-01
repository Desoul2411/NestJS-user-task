import { Module } from '@nestjs/common';
import { UsersModule } from './modules/user-web/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UserOrmEntity } from './modules/user-persistence/user.orm.entity';
import { UserPersistenceModule } from './modules/user-persistence/user-persistance.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1',
      database: 'user_schema',
      entities: [UserOrmEntity],
      synchronize: true,
    }),
    UsersModule,
    UserPersistenceModule
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
