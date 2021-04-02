import { HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserCommand } from '../ports/in/update-user.command';
import { UpdateUserUseCase } from '../ports/in/update-user.use-case';
import { LoadUserPort } from '../ports/out/load-user.port';
import { UpdateUserStatePort } from '../ports/out/update-user-port';

export class UpdateUserService implements UpdateUserUseCase{
	constructor(
		private readonly _updateUserPort: UpdateUserStatePort,
		private readonly _loadUserPort: LoadUserPort,
	) {}


	async updateUser(command: UpdateUserCommand){
		const user: UserEntity = await this._loadUserPort.loadUser(command.id, command.userData)   //.updateUser(command.id, command.userData)

		if(!user.comparePasswords( user.userOldPassword, user.currentUserPasswordDecrypted)) {
			console.log("PASSWORDS DIDN'T MATCH");
			throw new HttpException('Invalid old password!', HttpStatus.FORBIDDEN);
			//return false;
		}

		user.selectUserGroup(user.isSameNameUser, user.userId);

		return this._updateUserPort.updateUserState(user);
	}
}