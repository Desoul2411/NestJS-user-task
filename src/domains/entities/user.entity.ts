export type UserId = number;
export type UserName = string;
export type UserPassword = string;
export type UserGroup = number;


export class UserEntity {
	constructor(
		private readonly _userId: UserId,
		private readonly _userName: UserName,
		private readonly _userPassword: UserPassword,
        private readonly _group: UserGroup
	) {}


    get userId(): UserId {
        return this._userId
    }

    get userName(): UserName {
        return this._userName;
    }

    get userPasword(): UserPassword {
        return this._userPassword;
    }

    get group(): UserGroup {
        return this._group;
    }


    public selectUserGroup() {
        
    }



}