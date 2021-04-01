/* import { UserName, UserNewPassword } from '../../entities/user.entity'; */

import { CreateUserDataDto } from "src/modules/user-web/dto/create-user-data.dto";


export class CreateUserCommand {
	constructor(
		/* private readonly _userName: UserName,
		private readonly _userNewPassword: UserNewPassword */
        /*private readonly _userOldPassword: UserOldPassword, */
        /*private readonly _signature: Signature, */
        private readonly _userData: CreateUserDataDto
	) {}

    get userData(): CreateUserDataDto {
        return this._userData;
    }


/*     get userName(): UserName {
        return this._userName;
    }

    get userNewPassword(): UserNewPassword {
        return this._userNewPassword;
    } */


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