/* 
import {LoadAccountPort} from '../ports/out/load-account.port';
import {UpdateAccountStatePort} from '../ports/out/update-account-state.port'; */

import { UserEntity } from '../entities/user.entity';
import { CreateUserCommand } from '../ports/in/create-user.command';
import { CreateUserUseCase } from '../ports/in/create-user.use-case';

export class CreateUserService implements CreateUserUseCase{
	constructor(
		private readonly _loadAccountPort: LoadAccountPort,
	) {}

	async createUser(command: CreateUserCommand){
		//const user: UserEntity = await this._loadAccountPort.loadAccount(command.sourceAccountId);
		

		return true;
	}
}