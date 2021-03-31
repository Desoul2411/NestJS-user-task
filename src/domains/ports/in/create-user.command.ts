

import { UserId, UserOldPassword, UserNewPassword, Signature } from '../../entities/user.entity';

export class CreateUserCommand {
	constructor(
		private readonly _userName: UserId,
		private readonly _userOldPassword: UserOldPassword,
		private readonly _userNewPassword: UserNewPassword,
        private readonly _signature: Signature,
	) {}


    get userName(): UserId {
        return this._userName;
    }

    get userOldPassword(): UserOldPassword {
        return this._userOldPassword;
    }

    get userNewPassword(): UserNewPassword {
        return this._userNewPassword;
    }

    get signature(): Signature {
        return this._signature;
    }
}