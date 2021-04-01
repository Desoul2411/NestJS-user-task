import { UserEntity } from '../entities/user.entity';
import { UpdateUserCommand } from '../ports/in/update-user.command';
import { UpdateUserUseCase } from '../ports/in/update-user.use-case';
import { UpdateUserPort } from '../ports/out/update-user-port';

export class UpdateUserService implements UpdateUserUseCase{
	constructor(
		private readonly _updateUserPort: UpdateUserPort,
	) {}

	async updateUser(command: UpdateUserCommand){
		const user: UserEntity = await this._updateUserPort.updateUser(command.id, command.userData)
		

		return user;
	}
}