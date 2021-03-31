
import {CreateUserCommand} from './create-user.command';

export const CreateUserUseCaseSymbol = Symbol('SendMoneyUseCase');

export interface CreateUserUseCase {
	createUser(command: CreateUserCommand): Promise<any>;   // think Promise<User>
}