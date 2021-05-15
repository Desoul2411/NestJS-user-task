import { Module } from '@nestjs/common';
import { UsersModule } from './modules/user-web/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UserOrmEntity } from './modules/user-persistence/user.orm.entity';
import { UserPersistenceModule } from './modules/user-persistence/user-persistance.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: 'localhost',
      host: process.env.MYSQL_HOST,
      port: +process.env.HTTP_PORT,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [UserOrmEntity],
      synchronize: true,
      //keepConnectionAlive: true,
      dropSchema: true,
    }),
    UsersModule,
    UserPersistenceModule,
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
