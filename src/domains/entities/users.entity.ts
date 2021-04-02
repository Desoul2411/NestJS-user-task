import {UserEntity} from './user.entity';
import {UserId} from './user.entity';

export class UserStoreEntity {
    private readonly _users: UserEntity[] = [];

    addUser(user: UserEntity) {
		this.users.push(user);
		return this;
	}

    get users(): UserEntity[] {
        return this._users;
    }
}