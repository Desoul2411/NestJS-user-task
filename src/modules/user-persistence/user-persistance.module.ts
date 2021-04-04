
import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { CreateUserUseCaseSymbol } from 'src/domains/ports/in/create-user.use-case';
import { UpdateUserUseCaseSymbol } from 'src/domains/ports/in/update-user.use-case';
import { CreateUserService } from 'src/domains/services/create-user.service';
/* import { UpdateUserService } from 'src/domains/services/update-user.service'; */
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
				return new CreateUserService(userPersistenceAdapterService,userPersistenceAdapterService);  // add one more if needed
			},
			inject: [UserPersistenceAdapterService]
		},
	/* 	{
			provide: UpdateUserUseCaseSymbol,
			useFactory: (userPersistenceAdapterService: UserPersistenceAdapterService) => {
				return new UpdateUserService(userPersistenceAdapterService);  // add one more if needed
			},
			inject: [UserPersistenceAdapterService]
		} */
	],
	exports: [
		CreateUserUseCaseSymbol,
		UpdateUserUseCaseSymbol
	]
})
export class UserPersistenceModule {}