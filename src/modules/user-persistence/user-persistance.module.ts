
import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
/* import { CreateUserUseCaseSymbol } from 'src/domains/ports/in/create-user.use-case'; */
import { UpdateUserUseCaseSymbol } from '../../domains/ports/in/update-user.use-case';
/* import { CreateUserService } from 'src/domains/services/create-user.service'; */
import { UpdateUserService } from '../../domains/services/update-user.service';
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
			provide: UpdateUserUseCaseSymbol,
			useFactory: (userPersistenceAdapterService: UserPersistenceAdapterService) => {
				return new UpdateUserService(userPersistenceAdapterService,userPersistenceAdapterService,userPersistenceAdapterService);
			},
			inject: [UserPersistenceAdapterService]
		},
	],
	exports: [
		UpdateUserUseCaseSymbol
	]
})
export class UserPersistenceModule {}