/* import { UserEntity } from '../entities/user.entity';
import { CreateUserCommand } from '../ports/in/create-user.command';
import { CreateUserUseCase } from '../ports/in/create-user.use-case';
import { CreateUserPort } from '../ports/out/create-user.port';
import { UpdateUserStatePort } from '../ports/out/update-user-port';

export class CreateUserService implements CreateUserUseCase{
	constructor(
		private readonly _createUserPort: CreateUserPort,
		private readonly _updateUserPort: UpdateUserStatePort,
	) {}

	async createUser(command: CreateUserCommand){
		const newUser: UserEntity = await this._createUserPort.createUser(command.userData);

		this._updateUserPort.updateUserState(newUser);

		return true;
	}
} */