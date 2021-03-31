

import { UserName, UserOldPassword, UserNewPassword, Signature } from '../../entities/user.entity';

export class CreateUserCommand {
	constructor(
		private readonly _userName: UserName,
		private readonly _userNewPassword: UserNewPassword
        /* 		private readonly _userOldPassword: UserOldPassword, */
   /*      private readonly _signature: Signature, */
	) {}


    get userName(): UserName {
        return this._userName;
    }

    get userNewPassword(): UserNewPassword {
        return this._userNewPassword;
    }


/*     get userName(): UserId {
        return this._userName;
    } */


    /* get userOldPassword(): UserOldPassword {
        return this._userOldPassword;
    } */

  

    /* get signature(): Signature {
        return this._signature;
    } */
}