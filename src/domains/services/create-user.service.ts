import { UserEntity } from '../entities/user.entity';
import { CreateUserCommand } from '../ports/in/create-user.command';
import { CreateUserUseCase } from '../ports/in/create-user.use-case';
import { CreateUserPort } from '../ports/out/create-user.port';

export class CreateUserService implements CreateUserUseCase{
	constructor(
		private readonly _createUserPort: CreateUserPort,
	) {}

	async createUser(command: CreateUserCommand){
		const user: UserEntity = await this._createUserPort.createUser(command.userData)
		

		return user;
	}
}