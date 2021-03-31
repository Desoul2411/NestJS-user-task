
import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { CreateUserUseCaseSymbol } from 'src/domains/ports/in/create-user.use-case';
import { CreateUserService } from 'src/domains/services/user.service';
import { UserOrmEntity } from './user.orm.entity';
import { UserPersistenceAdapterService } from './user.persistance-adapter.service';

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([UserOrmEntity])
	],
	providers: [
		UserPersistenceAdapterService,
		{
			provide: CreateUserUseCaseSymbol,
			useFactory: (userPersistenceAdapterService: UserPersistenceAdapterService) => {
				return new CreateUserService(userPersistenceAdapterService);  // add one more if needed
			},
			inject: [UserPersistenceAdapterService]
		}
	],
	exports: [
		CreateUserUseCaseSymbol
	]
})
export class UserPersistenceModule {}