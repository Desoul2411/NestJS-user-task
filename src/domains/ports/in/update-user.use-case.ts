
/* import { UserEntity } from 'src/domains/entities/user.entity'; */
import { UserOrmEntity } from 'src/modules/user-persistence/user.orm.entity';
import { UpdateUserCommand } from './update-user.command';


export const UpdateUserUseCaseSymbol = Symbol('UpdateUserUseCaseSymbol');

export interface UpdateUserUseCase {
	updateUser(command: UpdateUserCommand): Promise<UserOrmEntity>;  
}