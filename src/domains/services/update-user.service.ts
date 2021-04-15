import { HttpException, HttpStatus } from '@nestjs/common';

import { UserEntity } from '../entities/user.entity';
import { UpdateUserCommand } from '../ports/in/update-user.command';
import { UpdateUserUseCase } from '../ports/in/update-user.use-case';
import { LoadUserByIdPort } from '../ports/out/load-user-by-id.port';
import { LoadUserByNamePort } from '../ports/out/load-user-by-name.port';
import { UpdateUserStatePort } from '../ports/out/update-user-port';

export class UpdateUserService implements UpdateUserUseCase{
	constructor(
		private readonly _loadUserByIdPort: LoadUserByIdPort,
		private readonly _loadUserByNamePort: LoadUserByNamePort,
		private readonly _updateUserPort: UpdateUserStatePort,
	) {}


	async updateUser(command: UpdateUserCommand) {
		const userById: UserEntity = await this._loadUserByIdPort.loadUserById(command.id, command.userData);
		const userByName: UserEntity = await this._loadUserByNamePort.loadUserByName(command.userData.userName);

		if(!userById.comparePasswords(userById.userOldPassword, userById.currentUserPasswordDecrypted)) {
			console.log("PASSWORDS DIDN'T MATCH");
			throw new HttpException('Invalid old password!', HttpStatus.FORBIDDEN);
		}

		userById.selectUserGroup(userByName.userNewNameHashed, userById.userId);

		return this._updateUserPort.updateUserState(userById);
	}
}