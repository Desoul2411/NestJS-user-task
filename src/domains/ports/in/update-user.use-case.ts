
import { UserEntity } from 'src/domains/entities/user.entity';
import { UpdateUserCommand } from './update-user.command';


export const UpdateUserUseCaseSymbol = Symbol('UpdateUserUseCaseSymbol');

export interface UpdateUserUseCase {
	updateUser(command: UpdateUserCommand): Promise<UserEntity>;  
}